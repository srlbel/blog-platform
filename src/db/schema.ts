import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import utils from './utils';

export const blogs = sqliteTable('blogs', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => utils.createId()),
  title: text('title').notNull(),
  description: text('description'),
  slug: text('slug').notNull().unique(),
  creator: text('creator').notNull(),
  createdAt: text('created_at')
    .notNull()
    .$default(() => utils.currentDate()),
  updatedAt: text('updated_at')
    .notNull()
    .$default(() => utils.currentDate())
    .$onUpdate(() => utils.currentDate()),
});

export const table = {
  blogs,
} as const;

export type Table = typeof table;
