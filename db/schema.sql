-- ==========================================================
-- 0. 共通ユーティリティ関数・トリガー定義
-- ==========================================================
-- この関数は、テーブル内の updated_at カラムを自動的に更新するための共通トリガーです。
-- BEFORE UPDATE トリガーとして各テーブルで利用します。
-- 他のテーブル定義に依存しないため、最初に定義しておくのがベストです。

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==========================================================
-- 1. USERS テーブル
-- ==========================================================
-- アプリケーション内部でのユーザー識別用テーブル。
-- 認証基盤には依存せず、HTTPヘッダに含まれるメールアドレスを登録・参照します。
-- reputation は投票などで自動加算予定。

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    username VARCHAR(50),
    reputation INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- 2. QUESTIONS テーブル
-- ==========================================================
-- 投稿された質問を管理します。
-- user_id は users.id に外部キーで紐づく投稿者ID。
-- last_activity_at は回答やコメント時にアプリ側で更新されます。

CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    views_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_activity_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_questions_user_id ON questions(user_id);
CREATE INDEX idx_questions_created_at ON questions(created_at DESC);
CREATE INDEX idx_questions_last_activity ON questions(last_activity_at DESC);

-- ==========================================================
-- 3. ANSWERS テーブル
-- ==========================================================
-- 各質問に対する回答を格納します。
-- is_accepted フラグでベストアンサーを管理します。

CREATE TABLE answers (
    id SERIAL PRIMARY KEY,
    question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    body TEXT NOT NULL,
    is_accepted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_answers_question_id ON answers(question_id);
CREATE INDEX idx_answers_user_id ON answers(user_id);

-- ==========================================================
-- 4. TAGS テーブル
-- ==========================================================
-- タグ名とその説明・表示色を管理します。

CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    color VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- 5. QUESTION_TAGS 中間テーブル
-- ==========================================================
-- 多対多の質問とタグの関連を管理します。

CREATE TABLE question_tags (
    question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (question_id, tag_id)
);

CREATE INDEX idx_question_tags_tag_id ON question_tags(tag_id);

-- ==========================================================
-- 6. VOTES テーブル
-- ==========================================================
-- 投票情報を管理します。質問・回答の両方を対象にできる汎用設計です。
-- UNIQUE 制約により、同一ユーザーが同一対象に複数回投票することを防ぎます。

CREATE TABLE votes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    votable_type VARCHAR(20) CHECK (votable_type IN ('question', 'answer')),
    votable_id INTEGER NOT NULL,
    vote_type SMALLINT CHECK (vote_type IN (1, -1)),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, votable_type, votable_id)
);

CREATE INDEX idx_votes_votable ON votes(votable_type, votable_id);
CREATE INDEX idx_votes_user ON votes(user_id);

-- ==========================================================
-- 7. BOOKMARKS テーブル
-- ==========================================================
-- 質問のお気に入り（ブックマーク）を管理します。
-- UNIQUE 制約でユーザーあたり1件に制限します。

CREATE TABLE bookmarks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, question_id)
);

CREATE INDEX idx_bookmarks_user ON bookmarks(user_id);

-- ==========================================================
-- 8. トリガー設定（自動 updated_at 更新）
-- ==========================================================
-- 上で定義した update_timestamp() 関数を
-- 各テーブルの BEFORE UPDATE トリガーとして紐づけます。
-- これにより、更新時に自動で updated_at が現在時刻に書き換わります。

CREATE TRIGGER update_question_timestamp
BEFORE UPDATE ON questions
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_answer_timestamp
BEFORE UPDATE ON answers
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- ==========================================================
-- 9. 回答投稿時の質問アクティビティ更新トリガー
-- ==========================================================
-- 新しい回答が投稿された際に、対応する質問の last_activity_at を現在時刻に更新します。
-- これにより「最近アクティブな質問」をソートしたり、放置質問を検知できます。

CREATE OR REPLACE FUNCTION update_question_activity()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE questions
  SET last_activity_at = NOW()
  WHERE id = NEW.question_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_answer_activity
AFTER INSERT ON answers
FOR EACH ROW
EXECUTE FUNCTION update_question_activity();
