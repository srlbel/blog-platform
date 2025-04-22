import { Elysia, t } from 'elysia';
import { BlogRepository } from '../repositories/BlogRepository';
import { BlogService } from '../services/BlogService';
import { _blog } from '../models/Blog';

const _newBlog = t.Omit(_blog, ['id', 'createdAt', 'updatedAt']);

const blogRepo = new BlogRepository();
const blogService = new BlogService(blogRepo);

export const blogRoutes = new Elysia({ prefix: '/blogs', tags: ['Blog'] })
  .get(
    '/',
    async () => {
      const blogs = await blogService.getAll();

      return blogs;
    },
    {
      detail: {
        summary: 'Get all blogs',
        responses: {
          '200': {
            description: 'Get all blogs in the resource',
            content: { 'application/json': {} },
          },
        },
      },
    },
  )
  .get(
    '/:id',
    async ({ params, set }) => {
      const blog = await blogService.getOne(params.id);

      if (!blog) {
        set.status = 404;
        return { error: 'Not found' };
      }

      return blog;
    },
    {
      params: t.Object({ id: t.String() }),
      detail: {
        summary: 'Get a blog by ID',
        responses: {
          '200': {
            description: 'Get a single blog in the resource',
            content: { 'application/json': {} },
          },
          '404': {
            description: 'Blog not found',
            content: { 'application/json': {} },
          },
        },
      },
    },
  )
  .post(
    '/',
    async ({ body, set }) => {
      const blog = await blogService.create(body);

      set.status = 201;
      return blog;
    },
    {
      body: _newBlog,
      detail: {
        summary: 'Create a blog',
        responses: {
          '201': {
            description: 'Created a blog resource',
            content: { 'application/json': {} },
          },
        },
      },
    },
  )
  .delete(
    '/:id',
    async ({ params, set }) => {
      await blogService.delete(params.id);

      set.status = 204;
      return null;
    },
    {
      params: t.Object({ id: t.String() }),
      detail: {
        summary: 'Delete a blog',
        responses: {
          '204': {
            description: 'Deleted a blog resource',
            content: { 'application/json': {} },
          },
        },
      },
    },
  )
  .put(
    '/:id',
    async ({ params, body, set }) => {
      const blogToUpdate = await blogService.getOne(params.id);

      if (!blogToUpdate) {
        set.status = 404;
        return { error: 'blog not found' };
      }

      const updatedBlog = await blogService.update(params.id, body);

      set.status = 204;
      return updatedBlog;
    },
    {
      params: t.Object({ id: t.String() }),
      body: _newBlog,
      detail: {
        summary: 'Update a blog',
        responses: {
          '204': {
            description: 'Update a blog resource',
            content: { 'application/json': {} },
          },
          '404': {
            description: 'Blog not found',
            content: { 'application/json': {} },
          },
        },
      },
    },
  );
