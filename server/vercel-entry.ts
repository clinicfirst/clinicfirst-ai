import app from './app';

export default function handler(req: any, res: any) {
  // Extract original requested path if forwarded by Vercel rewrites
  const originalUrl =
    req.headers['x-matched-path'] ||
    req.headers['x-forwarded-uri'] ||
    req.headers['x-invoke-path'] ||
    req.originalUrl;

  if (
    originalUrl &&
    typeof originalUrl === 'string' &&
    originalUrl.startsWith('/api') &&
    (req.url === '/' ||
      req.url === '/api' ||
      req.url === '/api/' ||
      req.url === '/api/index' ||
      req.url === '/api/index.js' ||
      req.url.includes('[...all]') ||
      req.url.includes('[...path]'))
  ) {
    req.url = originalUrl;
  }

  return app(req, res);
}


