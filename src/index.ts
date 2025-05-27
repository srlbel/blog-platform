import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { blogRoutes } from './routes/BlogRoutes';
import { staticPlugin } from '@elysiajs/static';
import logixlysia from 'logixlysia';
import client from 'prom-client';

const PORT = process.env.PORT || 3000;
const timers = new WeakMap<Request, ReturnType<typeof httpRequestDuration.startTimer>>();

const register = new client.Registry();
client.collectDefaultMetrics({ register });

const httpRequestCounter = new client.Counter({
  name: 'http_request_total',
  help: 'Total of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});

const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2, 5] // in seconds
});

const inflightRequests = new client.Gauge({
  name: 'http_inflight_requests',
  help: 'Number of in-flight HTTP requests',
  labelNames: ['method', 'route'],
});

const httpErrorCounter = new client.Counter({
  name: 'http_errors_total',
  help: 'Total number of HTTP 5xx errors',
  labelNames: ['method', 'route', 'status_code'],
});

register.registerMetric(inflightRequests);
register.registerMetric(httpRequestCounter);
register.registerMetric(httpRequestDuration);
register.registerMetric(httpErrorCounter);

export const app = new Elysia()
  .onBeforeHandle(({ request, route }) => {
    timers.set(request, httpRequestDuration.startTimer());

    inflightRequests.inc({
      method: request.method,
      route: route ?? new URL(request.url, `http://${request.headers.host}`).pathname,
    });
  })
  .onAfterResponse(({ request, route, set }) => {
    const statusCode = set.status ?? 200;
    const timer = timers.get(request)

    if (Number(statusCode) >= 500) {
      httpErrorCounter.inc({
        method: request.method,
        route: route ?? new URL(request.url, `http://${request.headers.host}`).pathname,
        status_code: statusCode.toString(),
      });
    }

    if (timer) {
      timer({
        method: request.method,
        route: route ?? request.url,
        status_code: statusCode.toString(),
      })
    }

    httpRequestCounter.inc({
      method: request.method,
      route: route ?? request.url,
      status_code: statusCode.toString(),
    })

    inflightRequests.dec({
      method: request.method,
      route: route ?? new URL(request.url, `http://${request.headers.host}`).pathname,
    });
  })
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
    staticPlugin({
      prefix: '/',
      assets: './public',
      indexHTML: true,
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
        ip: true,
        logFilePath: './logs/example.log',
        customLogFormat: '{now} {level} {duration} {method} {pathname} {status} {message} {ip}',
      },
    }),
  )
  .use(blogRoutes)
  .get('/metrics', async ({ set }) => {
    set.headers = { 'content-type': register.contentType };

    return await register.metrics();
  })
  .listen(PORT);

console.log(`--- ENV: ${process.env.NODE_ENV} ---`);
