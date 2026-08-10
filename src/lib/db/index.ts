import { createClient, type InValue } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:liga-del-ente.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export { client };

export async function query<T>(sql: string, params?: InValue[]): Promise<T[]> {
  const result = await client.execute({
    sql,
    args: params || [],
  });
  return result.rows as T[];
}

type ExecuteArgs = { sql: string; args: InValue[] } | string;

export async function execute(arg: ExecuteArgs, params?: InValue[]): Promise<void> {
  if (typeof arg === 'string') {
    await client.execute({
      sql: arg,
      args: params || [],
    });
  } else {
    await client.execute(arg);
  }
}