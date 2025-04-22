import { beforeEach, describe, expect, it } from 'bun:test';
import { treaty } from '@elysiajs/eden';
import { blogRoutes } from '../src/routes/BlogRoutes';
import { db } from '../src/db';
import { blogs } from '../src/db/schema';

const api = treaty(blogRoutes);

describe('blog tests', () => {
  const testBlog = {
    creator: 'Creator',
    slug: 'https://a1.url.com',
    title: 'A title',
    description: 'A description',
  };

  beforeEach(async () => {
    // purge test database for testing
    await db.delete(blogs);
  });

  describe('GET /', () => {
    it('should returns an array of objects', async () => {
      const { data, error } = await api.blogs.index.get();

      expect(error).toBeNull();
      expect(data).toBeArray();
      expect(data).toBeObject();
    });
  });

  describe('POST /', () => {
    it('should create a single object', async () => {
      const { data, error, status } = await api.blogs.index.post(testBlog);

      expect(error).toBeNull();

      expect(status).toBe(201);
      expect(data?.id).toBeDefined();
      expect(data?.title).toBe(testBlog.title);
    });

    it('should validate the fields', async () => {
      const { error } = await api.blogs.index.post({ title: 'A title' });

      expect(error).not.toBeNull();
    });
  });

  describe('GET /:id ', () => {
    it('should return an object', async () => {
      const { data: created } = await api.blogs.index.post(testBlog);

      const { data, error } = await api.blogs({ id: created.id }).get();

      expect(error).toBeNull();
      expect(data).toBeObject();
      expect(data?.id).toBe(created?.id);
      expect(data?.title).toBe(created?.title);
    });

    it('should return 404 if blog not found', async () => {
      const { data, error } = await api.blogs({ id: 'no-id' }).get();

      expect(data).toBeNull();
      expect(error?.status).toBe(404);
    });
  });

  describe('PUT /:id', () => {
    it('should update a blog', async () => {
      const { data: created } = await api.blogs.index.post(testBlog);

      const updatedData = {
        title: 'Updated Title',
        description: 'Updated Content',
        creator: 'Updated Author',
        slug: 'slug',
      };

      const { error, status } = await api.blogs({ id: created.id }).put(updatedData);

      expect(error).toBeNull();
      expect(status).toBe(204);

      const { data: updated } = await api.blogs({ id: created.id }).get();
      expect(updated?.title).toBe(updatedData.title);
    });

    it('should return 404 if blog to update not found', async () => {
      const { error } = await api.blogs({ id: 'non-existent-id' }).put(testBlog);

      expect(error?.status).toBe(404);
    });
  });

  describe('DELETE /blogs/:id', () => {
    it('should delete a blog', async () => {
      // First create a blog
      const { data: created } = await api.blogs.post(testBlog);

      // Using the correct treaty API format for path parameters
      const { error, status } = await api.blogs({ id: created.id }).delete();

      expect(error).toBeNull();
      expect(status).toBe(204);

      // Verify the blog is deleted
      const { data, error: getError } = await api.blogs({ id: created.id }).get();
      expect(data).toBeNull();
      expect(getError?.status).toBe(404);
    });

    it('should return success even if blog to delete not found', async () => {
      // This is a common API pattern - DELETE is idempotent
      const { status } = await api.blogs({ id: 'non-existent-id' }).delete();

      expect(status).toBe(204);
    });
  });
});
