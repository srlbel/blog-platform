import { createInsertSchema } from 'drizzle-typebox';
import { table, type blogs } from '../db/schema';

export type Blog = typeof blogs.$inferSelect;
export type NewBlog = typeof blogs.$inferInsert;

export const _blog = createInsertSchema(table.blogs);
