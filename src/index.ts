import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { blogRoutes } from './routes/BlogRoutes';
import logixlysia from 'logixlysia';

const PORT = process.env.PORT || 3000;

export const app = new Elysia()
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
  .use(
    logixlysia({
      config: {
        showStartupMessage: true,
        startupMessageFormat: 'simple',
        timestamp: {
          translateTime: 'yyyy-mm-dd HH:MM:ss',
        },
        ip: false,
        logFilePath: './logs/example.log',
        customLogFormat:
          '{now} {level} {duration} {method} {pathname} {status} {message} {ip} {epoch}',
      },
    }),
  )
  .use(blogRoutes)
  .listen(PORT);

console.log(`--- ENV: ${process.env.NODE_ENV} ---`);
