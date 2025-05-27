import Elysia from 'elysia';
import client from 'prom-client';

const register = new client.Registry();
client.collectDefaultMetrics({ register });

const httpRequestCounter = new client.Counter({
  name: 'http_request_total',
  help: 'Total of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});

register.registerMetric(httpRequestCounter);

export const prometheusPlugin = new Elysia({ name: 'prometheus' })
  .onBeforeHandle((ctx) => {})
  .onAfterHandle(({ request, response, path }) => {
    httpRequestCounter.inc({
      method: request.method,
      route: path,
      status_code: response.status,
    });
  })
  .get('/metrics', async ({ set }) => {
    set.headers = { 'content-type': register.contentType };

    return await register.metrics();
  });
