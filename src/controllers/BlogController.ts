import { t } from 'elysia';
import { BlogService } from '../services/BlogService';
import { BlogRepository } from '../repositories/BlogRepository';

const blogRepo = new BlogRepository();
const blogService = new BlogService(blogRepo);

export const blogController = {
    getAll: async () => blogService.getAll(),

    getOne: async ({ params }: { params: { id: string } }) => {
        const blog = await blogService.getOne(Number(params.id));
        return blog ?? { error: 'Not found' };
    },

    create: async ({ body }: { body: any }) => {
        const blog = await blogService.create(body);
        return blog;
    },

    delete: async ({ params }: { params: { id: string } }) => {
        await blogService.delete(Number(params.id));
        return new Response(null, { status: 204 });
    },

    update: async ({ params, body }: { params: { id: string }, body: any }) => {
        const blog = await blogService.update(Number(params.id), body);
        if (!blog) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });

        return blog;
    },

    schema: {
        create: t.Object({
            title: t.String(),
            description: t.Optional(t.String()),
            slug: t.String(),
            creator: t.String(),
        }),
        update: t.Partial(
            t.Object({
                title: t.String(),
                description: t.Optional(t.String()),
                slug: t.String(),
                creator: t.String(),
            })
        ),
    },
};
