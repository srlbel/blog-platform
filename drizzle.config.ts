import { defineConfig } from 'drizzle-kit';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: `.env.${process.env.NODE_ENV || 'dev'}` });

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'sqlite',
  dbCredentials: {
    url: process.env.DB_FILE_NAME!,
  },
});
