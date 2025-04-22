import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { blogRoutes } from './routes/BlogRoutes';

new Elysia()
  .use(
    swagger({
      path: '/swagger',
      documentation: {
        info: {
          title: 'Blog API',
          version: '1.0.0',
        },
      },
    }),
  )
  .use(blogRoutes)
  .listen(3000);

console.log('Listening at http://localhost:3000');
