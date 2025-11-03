export interface DatabaseClient {
  query<T = any>(sql: string, params?: any[]): Promise<{ rows: T[] }>
  execute(sql: string, params?: any[]): Promise<void>
}
