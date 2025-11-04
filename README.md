# 業務後Overflow
* Stack Overflowクローンで、社内向けのため、プログラミングに限らず幅広いトピックを想定。

## コンセプト
* 質問者は匿名化することで気軽に質問できることをコンセプトに。※回答者は名前あり。
* 回答者には貢献ポイントが付与されるインセンティブモデル

## アーキテクチャ

### DB設計
* ER図

```
erDiagram

  users {
    INT id PK
    VARCHAR email
    VARCHAR username
    INT reputation
    TIMESTAMP created_at
  }

  questions {
    INT id PK
    INT user_id FK
    VARCHAR title
    TEXT body
    INT views_count
    TIMESTAMP created_at
    TIMESTAMP updated_at
    TIMESTAMP last_activity_at
  }

  answers {
    INT id PK
    INT question_id FK
    INT user_id FK
    TEXT body
    BOOLEAN is_accepted
    TIMESTAMP created_at
    TIMESTAMP updated_at
  }

  tags {
    INT id PK
    VARCHAR name
    TEXT description
    VARCHAR color
    TIMESTAMP created_at
  }

  question_tags {
    INT question_id FK
    INT tag_id FK
  }

  votes {
    INT id PK
    INT user_id FK
    VARCHAR votable_type
    INT votable_id
    SMALLINT vote_type
    TIMESTAMP created_at
  }

  bookmarks {
    INT id PK
    INT user_id FK
    INT question_id FK
    TIMESTAMP created_at
  }

  %% リレーション
  users ||--o{ questions : "asks"
  users ||--o{ answers : "writes"
  questions ||--o{ answers : "has"
  questions ||--o{ question_tags : ""
  tags ||--o{ question_tags : ""
  users ||--o{ votes : "casts"
  users ||--o{ bookmarks : "marks"
  questions ||--o{ bookmarks : ""
  
  %% votesの多態参照について注釈
  %% votes.votable_type + votable_id は questions / answers どちらにも紐づく
  %% Mermaidのer図仕様上、ポリモーフィック参照は明示的には表現できません
  ```

# PC上での起動

## Google FontのSSL Error

* Next.js 16.0では以下で対応
```
set NEXT_TURBOPACK_EXPERIMENTAL_USE_SYSTEM_TLS_CERTS=1
```

* Next.js 15以前では以下で対応
```
set NODE_TLS_REJECT_UNAUTHORIZED=0
```
