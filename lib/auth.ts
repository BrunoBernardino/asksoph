import { decodeBase64Url, encodeBase64Url } from 'std/encoding/base64url.ts';
import { Cookie, getCookies, setCookie } from 'std/http/cookie.ts';
import 'std/dotenv/load.ts';

import { baseUrl, isRunningLocally } from './utils.ts';
import { User, UserSession } from './types.ts';
import { createUserSession, deleteUserSession, validateUserAndSession } from './data-utils.ts';

const JWT_SECRET = Deno.env.get('JWT_SECRET') || '';
export const PASSWORD_SALT = Deno.env.get('PASSWORD_SALT') || '';
export const COOKIE_NAME = 'asksoph-app-v1';

export interface JwtData {
  data: {
    user_id: string;
    session_id: string;
  };
}

const textToData = (text: string) => new TextEncoder().encode(text);

export const dataToText = (data: Uint8Array) => new TextDecoder().decode(data);

const generateKey = async (key: string) =>
  await crypto.subtle.importKey('raw', textToData(key), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);

async function signAuthJwt(key: CryptoKey, data: JwtData) {
  const payload = encodeBase64Url(textToData(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))) + '.' +
    encodeBase64Url(textToData(JSON.stringify(data) || ''));
  const signature = encodeBase64Url(
    new Uint8Array(await crypto.subtle.sign({ name: 'HMAC' }, key, textToData(payload))),
  );
  return `${payload}.${signature}`;
}

async function verifyAuthJwt(key: CryptoKey, jwt: string) {
  const jwtParts = jwt.split('.');
  if (jwtParts.length !== 3) {
    throw new Error('Malformed JWT');
  }

  const data = textToData(jwtParts[0] + '.' + jwtParts[1]);
  if (await crypto.subtle.verify({ name: 'HMAC' }, key, decodeBase64Url(jwtParts[2]), data) === true) {
    return JSON.parse(dataToText(decodeBase64Url(jwtParts[1]))) as JwtData;
  }

  throw new Error('Invalid JWT');
}

export async function getDataFromRequest(request: Request) {
  const cookies = getCookies(request.headers);

  if (!cookies[COOKIE_NAME]) {
    return null;
  }

  const result = await getDataFromCookie(cookies[COOKIE_NAME]);

  return result;
}

async function getDataFromCookie(cookieValue: string) {
  if (!cookieValue) {
    return null;
  }

  const key = await generateKey(JWT_SECRET);

  try {
    const token = await verifyAuthJwt(key, cookieValue) as JwtData;

    const { user, session } = await validateUserAndSession(token.data.user_id, token.data.session_id);

    return { user, session, tokenData: token.data };
  } catch (error) {
    console.error(error);
  }

  return null;
}

export async function generateToken(tokenData: JwtData['data']) {
  const key = await generateKey(JWT_SECRET);

  const token = await signAuthJwt(key, { data: tokenData });

  return token;
}

export async function logoutUser(request: Request, match: URLPatternResult) {
  const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1));

  const cookies = getCookies(request.headers);

  const result = await getDataFromCookie(cookies[COOKIE_NAME]);

  if (!result || !result.tokenData?.session_id || !result.user) {
    throw new Error('Invalid session');
  }

  const { tokenData } = result;
  const { session_id } = tokenData;

  // Delete user session
  await deleteUserSession(session_id);

  // Generate response with empty and expiring cookie
  const cookie: Cookie = {
    name: COOKIE_NAME,
    value: '',
    expires: tomorrow,
    domain: isRunningLocally(match) ? 'localhost' : baseUrl.replace('https://', ''),
    path: '/',
    secure: isRunningLocally(match) ? false : true,
    httpOnly: true,
    sameSite: 'Lax',
  };

  const response = new Response('Logged Out', {
    status: 302,
    headers: { 'Location': '/', 'Content-Type': 'text/html; charset=utf-8' },
  });

  setCookie(response.headers, cookie);

  return response;
}

export async function createSessionResponse(
  _request: Request,
  match: URLPatternResult,
  user: User,
  { urlToRedirectTo = '/' }: {
    urlToRedirectTo?: string;
  } = {},
) {
  const newSession = await createUserSession(user);

  // Generate response with session cookie
  const token = await generateToken({ user_id: user.id, session_id: newSession.id });

  const cookie: Cookie = {
    name: COOKIE_NAME,
    value: token,
    expires: newSession.expires_at,
    domain: isRunningLocally(match) ? 'localhost' : baseUrl.replace('https://', ''),
    path: '/',
    secure: isRunningLocally(match) ? false : true,
    httpOnly: true,
    sameSite: 'Lax',
  };

  const response = new Response('Logged In', {
    status: 302,
    headers: { 'Location': urlToRedirectTo, 'Content-Type': 'text/html; charset=utf-8' },
  });

  setCookie(response.headers, cookie);

  return response;
}

export async function updateSessionCookie(
  response: Response,
  match: URLPatternResult,
  userSession: UserSession,
  newSessionData: JwtData['data'],
) {
  const token = await generateToken(newSessionData);

  const cookie: Cookie = {
    name: COOKIE_NAME,
    value: token,
    expires: userSession.expires_at,
    domain: isRunningLocally(match) ? 'localhost' : baseUrl.replace('https://', ''),
    path: '/',
    secure: isRunningLocally(match) ? false : true,
    httpOnly: true,
    sameSite: 'Lax',
  };

  setCookie(response.headers, cookie);

  return response;
}
