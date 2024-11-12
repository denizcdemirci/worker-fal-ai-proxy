import { Env } from './types/base';

const TARGET_URL_HEADER = 'x-fal-target-url';
const FAL_URL_REG_EXP = /(\.|^)fal\.(run|ai)$/;
const EXCLUDED_HEADERS = ['Content-Length', 'Content-Encoding'];
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
  'Access-Control-Allow-Headers': '*'
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    if (request.method !== 'GET' && request.method !== 'POST') {
      return new Response(null, {
        status: 405,
        headers: CORS_HEADERS
      });
    }

    if (request.method === 'POST' && request.headers.get('Content-Type') !== 'application/json') {
      return new Response(null, {
        status: 415,
        headers: CORS_HEADERS
      });
    }

    const FAL_KEY = env.FAL_KEY;
    if (!FAL_KEY) {
      return new Response('Missing fal.ai credentials', {
        status: 401,
        headers: CORS_HEADERS
      });
    }

    const targetUrl = request.headers.get(TARGET_URL_HEADER);
    if (!targetUrl) {
      return new Response(`Invalid ${TARGET_URL_HEADER} header`, {
        status: 400,
        headers: CORS_HEADERS
      });
    }

    const urlHost = new URL(targetUrl).host;
    if (!FAL_URL_REG_EXP.test(urlHost)) {
      return new Response(`Invalid ${TARGET_URL_HEADER} header`, {
        status: 412,
        headers: CORS_HEADERS
      });
    }

    const headers = new Headers(request.headers);
    headers.set('Authorization', `Key ${FAL_KEY}`);
    headers.set('Accept', 'application/json');
    headers.set('Content-Type', 'application/json');
    headers.set('User-Agent', request.headers.get('User-Agent') || '');
    headers.set('x-fal-client-proxy', 'denizcdemirci/worker-fal-ai-proxy');

    Object.keys(request.headers).forEach((key) => {
      if (key.toLowerCase().startsWith("x-fal-")) {
        headers.set(key, request.headers.get(key) || '');
      }
    });

    const proxyRequest = new Request(targetUrl, {
      method: request.method,
      headers: headers,
      body: request.body
    });

    try {
      const response = await fetch(proxyRequest);
      const newResponse = new Response(response.body, response);

      response.headers.forEach((value, key) => {
        if (!EXCLUDED_HEADERS.includes(key)) {
          newResponse.headers.set(key, value);
        }
      });

      Object.entries(CORS_HEADERS).forEach(([key, value]) => {
        newResponse.headers.set(key, value);
      });

      return newResponse;
    } catch (error) {
      return new Response(JSON.stringify({ error }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...CORS_HEADERS
        }
      });
    }
  }
};
