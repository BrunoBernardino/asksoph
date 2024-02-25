import { serveFile } from 'std/http/file_server.ts';
import { baseUrl, basicLayoutResponse, getIpAddress, serveFileWithSass, serveFileWithTs } from './lib/utils.ts';
import { getDataFromRequest } from './lib/auth.ts';
import { PageContent } from './lib/types.ts';

export interface Route {
  pattern: URLPattern;
  handler: (
    request: Request,
    match: URLPatternResult,
    connectionInfo: Deno.ServeHandlerInfo,
  ) => Response | Promise<Response>;
}

interface Routes {
  [routeKey: string]: Route;
}

interface Page {
  pageContent: PageContent;
  pageAction: PageContent;
}

function createBasicRouteHandler(id: string, pathname: string) {
  return {
    pattern: new URLPattern({ pathname }),
    handler: async (request: Request, match: URLPatternResult, connectionInfo: Deno.ServeHandlerInfo) => {
      try {
        const { pageContent, pageAction }: Page = await import(
          `./pages/${id}.ts`
        );

        const ipAddress = getIpAddress(request, connectionInfo);

        const { user, session } = (await getDataFromRequest(request)) || {};

        if (request.method !== 'GET' && request.method !== 'OPTIONS') {
          const pageContentResult = await pageAction(request, match, { user, session, ipAddress });

          if (pageContentResult instanceof Response) {
            return pageContentResult;
          }

          const { htmlContent: htmlContent, titlePrefix } = pageContentResult;

          return basicLayoutResponse(htmlContent, { currentPath: match.pathname.input, titlePrefix, user, session });
        }

        const pageContentResult = await pageContent(request, match, { user, session, ipAddress });

        if (pageContentResult instanceof Response) {
          return pageContentResult;
        }

        const { htmlContent: htmlContent, titlePrefix } = pageContentResult;

        return basicLayoutResponse(htmlContent, { currentPath: match.pathname.input, titlePrefix, user, session });
      } catch (error) {
        if (error.toString().includes('NotFound')) {
          return new Response('Not Found', { status: 404 });
        }

        console.error(error);

        return new Response('Internal Server Error', { status: 500 });
      }
    },
  };
}

const oneDayInSeconds = 24 * 60 * 60;

const routes: Routes = {
  sitemap: {
    pattern: new URLPattern({ pathname: '/sitemap.xml' }),
    handler: (_request) => {
      const pages = [
        '/',
        '/pricing',
      ];

      const oneHourAgo = new Date(new Date().setHours(new Date().getHours() - 1));

      const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  ${
        pages.map((page) => `
    <url>
      <loc>${baseUrl}${page}</loc>
      <lastmod>${oneHourAgo.toISOString()}</lastmod>
      <priority>${page === '/' ? '1.0' : '0.8'}</priority>
    </url>
  `).join('')
      }
</urlset>
`;

      return new Response(sitemapContent, {
        headers: {
          'content-type': 'application/xml; charset=utf-8',
          'cache-control': `max-age=${oneDayInSeconds}, public`,
        },
      });
    },
  },
  robots: {
    pattern: new URLPattern({ pathname: '/robots.txt' }),
    handler: async (request) => {
      const response = await serveFile(request, `public/robots.txt`);
      response.headers.set('cache-control', `max-age=${oneDayInSeconds}, public`);
      return response;
    },
  },
  favicon: {
    pattern: new URLPattern({ pathname: '/favicon.ico' }),
    handler: async (request) => {
      const response = await serveFile(request, `public/images/favicon.ico`);
      response.headers.set('cache-control', `max-age=${oneDayInSeconds}, public`);
      return response;
    },
  },
  public: {
    pattern: new URLPattern({ pathname: '/public/:filePath*' }),
    handler: async (request, match) => {
      const { filePath } = match.pathname.groups;

      try {
        const fullFilePath = `public/${filePath}`;

        const fileExtension = filePath!.split('.').pop()?.toLowerCase();

        let response: Response;

        if (fileExtension === 'ts') {
          response = await serveFileWithTs(request, fullFilePath);
        } else if (fileExtension === 'scss') {
          response = await serveFileWithSass(request, fullFilePath);
        } else {
          response = await serveFile(request, fullFilePath);
        }
        response.headers.set('cache-control', `max-age=${oneDayInSeconds}, public`);
        return response;
      } catch (error) {
        if (error.toString().includes('NotFound')) {
          return new Response('Not Found', { status: 404 });
        }

        console.error(error);

        return new Response('Internal Server Error', { status: 500 });
      }
    },
  },
  index: createBasicRouteHandler('index', '/'),
  pricing: createBasicRouteHandler('pricing', '/pricing'),
  terms: createBasicRouteHandler('terms', '/terms'),
  privacy: createBasicRouteHandler('privacy', '/privacy'),
  login: createBasicRouteHandler('login', '/login'),
  logout: createBasicRouteHandler('logout', '/logout'),
  settings: createBasicRouteHandler('settings', '/settings'),
  billing: createBasicRouteHandler('billing', '/billing'),
  apiChat: createBasicRouteHandler('api/chat', '/api/chat'),
};

export default routes;
