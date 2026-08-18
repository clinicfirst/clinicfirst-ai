import express from 'express';
import dotenv from 'dotenv';
import { authRouter } from './routes/auth.routes';
import { platformRouter } from './routes/platform.routes';
import { clinicRouter } from './routes/clinic.routes';
import { aiRouter } from './routes/ai.routes';

dotenv.config();

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/platform', platformRouter);
app.use('/api/clinic', clinicRouter);
app.use('/api/ai', aiRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'CLINICFIRST API',
    timestamp: new Date().toISOString(),
  });
});

export { app };
export default app;
