import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';

import blogRouter from './routes/BlogRoutes'

const app = new OpenAPIHono();

app.route('/api/blogs', blogRouter);

app.doc('/doc', {
  info: {
    title: "Blog Platform API",
    version: "v1",
  },
  openapi: '3.1.0'
})

app.get('/ui', swaggerUI({ url: '/doc' }))

export default app
