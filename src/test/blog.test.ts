import { describe, expect, it } from 'bun:test';
import { treaty } from '@elysiajs/eden';
import { blogRoutes } from '../routes/BlogRoutes';

const api = treaty(blogRoutes)

describe("blog tests", () => {
    it('/ returns an object', async () => {
        const { data, error } = await api.blogs.index.get();

        expect(error).toBeNull();
        expect(data).toBeObject();
    })
})