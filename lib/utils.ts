import 'std/dotenv/load.ts';
import { transpile } from 'https://deno.land/x/emit@0.33.0/mod.ts';
import sass from 'https://deno.land/x/denosass@1.0.6/mod.ts';
import { serveFile } from 'std/http/file_server.ts';

import menu from '/components/menu.ts';
import loading from '/components/loading.ts';
import { User, UserSession } from './types.ts';

// This allows us to have nice html syntax highlighting in template literals
export const html = String.raw;

export const baseUrl = Deno.env.get('BASE_URL') || 'https://asksoph.com';
export const defaultTitle = 'Ask Soph about a dead philosopher';
export const defaultDescription =
  'Soph is a bot that will try to help you understand the work of a list of dead philosophers.';
export const helpEmail = 'help@asksoph.com';

export const PORT = Deno.env.get('PORT') || 8000;
export const STRIPE_PAYMENT_URL = 'https://buy.stripe.com/3csdSxcA4gzn6CQ8wX';

interface BasicLayoutOptions {
  currentPath: string;
  titlePrefix?: string;
  description?: string;
  user?: User;
  session?: UserSession;
}

async function basicLayout(
  htmlContent: string,
  { currentPath, titlePrefix, description, user, session }: BasicLayoutOptions,
) {
  let title = defaultTitle;

  if (titlePrefix) {
    title = `${titlePrefix} - Ask Soph`;
  }

  return html`
    <!doctype html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>${title}</title>
      <meta name="description" content="${description || defaultDescription}">
      <meta name="author" content="Bruno Bernardino">
      <meta property="og:title" content="${title}" />
      <link rel="icon" href="/public/images/favicon.png" type="image/png">
      <link rel="apple-touch-icon" href="/public/images/favicon.png">
      <link rel="stylesheet" href="/public/scss/style.scss">
      <link rel="stylesheet" href="/public/css/style.css">

      <link rel="manifest" href="/public/manifest.json" />
      
      <link rel="alternate" type="application/rss+xml" href="https://news.onbrn.com/rss.xml" />
      <link rel="alternate" type="application/atom+xml" href="https://news.onbrn.com/atom.xml" />
      <link rel="alternate" type="application/feed+json" href="https://news.onbrn.com/feed.json" />
    </head>
    <body>
      ${loading()}
      <section id="panels-wrapper">
        ${await menu(currentPath, user, session)}
        ${htmlContent}
      </section>
      <script type="text/javascript">
        window.app = {
          STRIPE_PAYMENT_URL: '${STRIPE_PAYMENT_URL}',
        };
      </script>
      <script src="/public/js/script.js"></script>
      <script src="/public/js/sweetalert.js" defer></script>
    </body>
    </html>
    `;
}

export async function basicLayoutResponse(htmlContent: string, options: BasicLayoutOptions) {
  return new Response(await basicLayout(htmlContent, options), {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'content-security-policy':
        "default-src 'self'; child-src 'self'; img-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com;",
      'x-frame-options': 'DENY',
      'x-content-type-options': 'nosniff',
      'strict-transport-security': 'max-age=31536000; includeSubDomains; preload',
    },
  });
}

export function isRunningLocally(urlPatternResult: URLPatternResult) {
  return urlPatternResult.hostname.input.includes('localhost');
}

export function escapeHtml(unsafe: string) {
  return unsafe.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

async function transpileTs(content: string, specifier: URL) {
  const urlStr = specifier.toString();
  const result = await transpile(specifier, {
    load(specifier: string) {
      if (specifier !== urlStr) {
        return Promise.resolve({ kind: 'module', specifier, content: '' });
      }
      return Promise.resolve({ kind: 'module', specifier, content });
    },
  });
  return result.get(urlStr) || '';
}

export async function serveFileWithTs(request: Request, filePath: string, extraHeaders?: ResponseInit['headers']) {
  const response = await serveFile(request, filePath);

  if (response.status !== 200) {
    return response;
  }

  const tsCode = await response.text();
  const jsCode = await transpileTs(tsCode, new URL('file:///src.ts'));
  const { headers } = response;
  headers.set('content-type', 'application/javascript; charset=utf-8');
  headers.delete('content-length');

  return new Response(jsCode, {
    status: response.status,
    statusText: response.statusText,
    headers,
    ...(extraHeaders || {}),
  });
}

function transpileSass(content: string) {
  const compiler = sass(content);

  return compiler.to_string('compressed') as string;
}

export async function serveFileWithSass(request: Request, filePath: string, extraHeaders?: ResponseInit['headers']) {
  const response = await serveFile(request, filePath);

  if (response.status !== 200) {
    return response;
  }

  const sassCode = await response.text();
  const cssCode = transpileSass(sassCode);
  const { headers } = response;
  headers.set('content-type', 'text/css; charset=utf-8');
  headers.delete('content-length');

  return new Response(cssCode, {
    status: response.status,
    statusText: response.statusText,
    headers,
    ...(extraHeaders || {}),
  });
}

export function generateRandomCode(length = 6) {
  const getRandomDigit = () => Math.floor(Math.random() * (10)); // 0-9

  const codeDigits = Array.from({ length }).map(getRandomDigit);

  return codeDigits.join('');
}

export async function generateHash(value: string, algorithm: AlgorithmIdentifier) {
  const hashedValueData = await crypto.subtle.digest(
    algorithm,
    new TextEncoder().encode(value),
  );

  const hashedValue = Array.from(new Uint8Array(hashedValueData)).map(
    (byte) => byte.toString(16).padStart(2, '0'),
  ).join('');

  return hashedValue;
}

export function splitArrayInChunks<T = any>(array: T[], chunkLength: number) {
  const chunks = [];
  let chunkIndex = 0;
  const arrayLength = array.length;

  while (chunkIndex < arrayLength) {
    chunks.push(array.slice(chunkIndex, chunkIndex += chunkLength));
  }

  return chunks;
}

export function getFormDataField(formData: FormData, field: string) {
  return ((formData.get(field) || '') as string).trim();
}

export function getFormDataFieldArray(formData: FormData, field: string) {
  return ((formData.getAll(field) || []) as string[]).map((value) => value.trim());
}

export function validateEmail(email: string) {
  const trimmedEmail = (email || '').trim().toLocaleLowerCase();
  if (!trimmedEmail) {
    return false;
  }

  const requiredCharsNotInEdges = ['@', '.'];
  return requiredCharsNotInEdges.every((char) =>
    trimmedEmail.includes(char) && !trimmedEmail.startsWith(char) && !trimmedEmail.endsWith(char)
  );
}

export function getIpAddress(request: Request, connectionInfo: Deno.ServeHandlerInfo) {
  const { hostname } = (connectionInfo.remoteAddr || {}) as Deno.NetAddr;
  return (request.headers.get('x-real-ip') || hostname || 'unknown').split(':')[0];
}
