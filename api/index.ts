import app from '../server/app';

export default function handler(req: any, res: any) {
  const originalUrl = req.headers['x-matched-path'] || req.headers['x-forwarded-uri'] || req.headers['x-invoke-path'] || req.originalUrl;
  
  if (originalUrl && typeof originalUrl === 'string' && originalUrl.startsWith('/api')) {
    req.url = originalUrl;
  }
  
  return app(req, res);
}
