import { z } from '@hono/zod-openapi';
import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { BlogService } from '../services/BlogService';

const BlogResponse = z.object({
    id: z.number(),
    title: z.string(),
    description: z.string().nullable(),
    slug: z.string(),
    creator: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

const BlogInput = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    slug: z.string().min(1),
    creator: z.string().min(1),
});

export class BlogController {
    constructor(private service: BlogService) { }

    getRoutes() {
        const app = new OpenAPIHono();

        app.openapi(
            createRoute({
                method: 'get',
                path: '/',
                summary: 'List all blogs',
                responses: {
                    200: {
                        description: 'A list of blogs',
                        content: {
                            'application/json': {
                                schema: z.array(BlogResponse),
                            },
                        },
                    },
                },
            }),
            async (c) => {
                const blogs = await this.service.getAll();
                return c.json(blogs);
            }
        );

        app.openapi(
            createRoute({
                method: 'get',
                path: '/{id}',
                summary: 'Get a blog by ID',
                request: {
                    params: z.object({
                        id: z.string(),
                    }),
                },
                responses: {
                    200: {
                        description: 'Blog found',
                        content: {
                            'application/json': {
                                schema: BlogResponse,
                            },
                        },
                    },
                    404: {
                        description: 'Blog not found',
                    },
                },
            }),
            async (c) => {
                const id = Number(c.req.valid('param').id);
                const blog = await this.service.getOne(id);
                if (!blog) return c.notFound();
                return c.json(blog);
            }
        );

        app.openapi(
            createRoute({
                method: 'post',
                path: '/',
                summary: 'Create a new blog',
                request: {
                    body: {
                        content: {
                            'application/json': {
                                schema: BlogInput,
                            },
                        },
                    },
                },
                responses: {
                    201: {
                        description: 'Created blog',
                        content: {
                            'application/json': {
                                schema: BlogResponse,
                            },
                        },
                    },
                    400: {
                        description: 'Validation failed',
                    },
                },
            }),
            async (c) => {
                const data = await c.req.valid('json');
                const blog = await this.service.create(data);
                return c.json(blog, 201);
            }
        );

        app.openapi(
            createRoute({
                method: 'delete',
                path: '/{id}',
                summary: 'Delete a blog by ID',
                request: {
                    params: z.object({
                        id: z.string(),
                    }),
                },
                responses: {
                    204: {
                        description: 'Deleted successfully',
                    },
                },
            }),
            async (c) => {
                const id = Number(c.req.valid('param').id);
                await this.service.delete(id);
                return c.body(null, 204);
            }
        );

        return app;
    }
}
