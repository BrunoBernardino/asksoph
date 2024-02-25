import routes, { Route } from './routes.ts';
import { startCrons } from './crons/index.ts';

function handler(request: Request, connectionInfo: Deno.ServeHandlerInfo) {
  const routeKeys = Object.keys(routes);

  for (const routeKey of routeKeys) {
    const route: Route = routes[routeKey];
    const match = route.pattern.exec(request.url);

    if (match) {
      return route.handler(request, match, connectionInfo);
    }
  }

  return new Response('Not found', {
    status: 404,
  });
}

export const abortController = new AbortController();

const PORT = Deno.env.get('PORT') || 8000;

Deno.serve({ port: PORT as number, signal: abortController.signal }, handler);

startCrons();
