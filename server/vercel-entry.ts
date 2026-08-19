import app from './app';

export default function handler(req: any, res: any) {
  // Extract original requested path if forwarded or catch-all pattern
  const originalUrl =
    req.headers['x-matched-path'] ||
    req.headers['x-forwarded-uri'] ||
    req.headers['x-invoke-path'];

  if (originalUrl && (req.url === '/' || req.url === '/api' || req.url === '' || req.url?.includes('[...all]') || req.url?.includes('[...path]'))) {
    req.url = originalUrl;
  }

  return app(req, res);
}

