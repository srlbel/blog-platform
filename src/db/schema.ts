import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const blogs = sqliteTable('blogs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  description: text('description'),
  slug: text('slug').notNull().unique(),
  creator: text('creator').notNull(),
  createdAt: text('created_at')
    .notNull()
    .$default(() => new Date().toISOString()),
  updatedAt: text('updated_at')
    .notNull()
    .$default(() => new Date().toISOString())
    .$onUpdate(() => new Date().toISOString()),
});

export const table = {
  blogs,
} as const;

export type Table = typeof table;
