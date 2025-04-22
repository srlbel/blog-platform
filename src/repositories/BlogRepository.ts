import { db } from '../db';
import { blogs } from '../db/schema';
import { eq } from 'drizzle-orm';
import type { Blog, NewBlog } from '../models/Blog';
import type { IRepository } from '../interfaces/IRepository';

export class BlogRepository implements IRepository<Blog, NewBlog> {
  async getAll(): Promise<Blog[]> {
    return db.select().from(blogs);
  }

  async getById(id: number): Promise<Blog | undefined> {
    const result = await db.select().from(blogs).where(eq(blogs.id, id));
    return result[0];
  }

  async create(data: NewBlog): Promise<Blog> {
    const result = await db.insert(blogs).values(data).returning();
    return result[0];
  }

  async delete(id: number): Promise<void> {
    await db.delete(blogs).where(eq(blogs.id, id));
  }

  async update(id: number, data: Partial<NewBlog>): Promise<Blog | undefined> {
    const result = await db
      .update(blogs)
      .set({ ...data })
      .where(eq(blogs.id, id))
      .returning();
    return result[0];
  }
}
