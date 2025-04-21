import { Elysia, t } from 'elysia';
import { blogController } from '../controllers/BlogController';

export const blogRoutes = new Elysia({ prefix: '/blogs' })
    .get('/', blogController.getAll, {
        detail: {
            summary: 'Get all blogs',
            tags: ['Blog'],
        },
    })
    .get('/:id', blogController.getOne, {
        params: t.Object({ id: t.String() }),
        detail: {
            summary: 'Get a blog by ID',
            tags: ['Blog'],
        },
    })
    .post('/', blogController.create, {
        body: blogController.schema.create,
        detail: {
            summary: 'Create a blog',
            tags: ['Blog'],
        },
    })
    .delete('/:id', blogController.delete, {
        params: t.Object({ id: t.String() }),
        detail: {
            summary: 'Delete a blog',
            tags: ['Blog'],
        },
    })
    .put('/:id', blogController.update, {
        params: t.Object({ id: t.String() }),
        body: blogController.schema.update,
        detail: {
            summary: 'Update a blog',
            tags: ['Blog']
        }
    })
    ;
