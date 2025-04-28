import { drizzle } from 'drizzle-orm/bun-sqlite';
import { Database } from 'bun:sqlite';
import { config } from 'dotenv';

config({ path: `.env.${Bun.env.NODE_ENV || 'dev'}` });

const sqlite = new Database(Bun.env.DB_FILE_NAME!);

export const db = drizzle({ client: sqlite });
