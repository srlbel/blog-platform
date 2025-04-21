import { Elysia, t } from 'elysia';
import { blogController } from '../controllers/BlogController';

export const blogRoutes = new Elysia({ prefix: '/blogs', tags: ['Blog'] })
    .get('/', blogController.getAll, {
        detail: {
            summary: 'Get all blogs',
        },
    })
    .get('/:id', blogController.getOne, {
        params: t.Object({ id: t.String() }),
        detail: {
            summary: 'Get a blog by ID',
        },
    })
    .post('/', blogController.create, {
        body: blogController.schema.create,
        detail: {
            summary: 'Create a blog',
        },
    })
    .delete('/:id', blogController.delete, {
        params: t.Object({ id: t.String() }),
        detail: {
            summary: 'Delete a blog',
        },
    })
    .put('/:id', blogController.update, {
        params: t.Object({ id: t.String() }),
        body: blogController.schema.update,
        detail: {
            summary: 'Update a blog',
        }
    })
    ;
