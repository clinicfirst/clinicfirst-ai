import app from '../server/app';

export default function handler(req: any, res: any) {
  // If Vercel rewrote /api/... to /api, extract the original URL
  const originalUrl =
    req.headers['x-matched-path'] ||
    req.headers['x-forwarded-uri'] ||
    req.headers['x-invoke-path'];

  if (originalUrl && (req.url === '/' || req.url === '/api' || req.url === '')) {
    req.url = originalUrl;
  }

  return app(req, res);
}
