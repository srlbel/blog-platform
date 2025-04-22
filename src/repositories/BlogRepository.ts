import { db } from '../db';
import { blogs } from '../db/schema';
import { eq } from 'drizzle-orm';
import type { Blog, NewBlog } from '../models/Blog';
import type { IRepository } from '../interfaces/IRepository';

export class BlogRepository implements IRepository<Blog, NewBlog> {
  async getAll(): Promise<Blog[]> {
    return db.select().from(blogs);
  }

  async getById(id: string): Promise<Blog | undefined> {
    const result = await db.select().from(blogs).where(eq(blogs.id, id));
    return result[0];
  }

  async create(data: NewBlog): Promise<Blog> {
    const result = await db.insert(blogs).values(data).returning();
    return result[0];
  }

  async delete(id: string): Promise<void> {
    await db.delete(blogs).where(eq(blogs.id, id));
  }

  async update(id: string, data: Partial<NewBlog>): Promise<Blog | undefined> {
    const result = await db
      .update(blogs)
      .set({ ...data })
      .where(eq(blogs.id, id))
      .returning();
    return result[0];
  }
}
