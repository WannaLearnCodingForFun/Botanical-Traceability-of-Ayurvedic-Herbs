import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import { router as collectionRouter } from './routes/collection.js';
import { router as processingRouter } from './routes/processing.js';
import { router as qualityRouter } from './routes/quality.js';
import { router as provenanceRouter } from './routes/provenance.js';
import { router as qrcodeRouter } from './routes/qrcode.js';
import { router as fabricLogsRouter } from './routes/fabric-logs.js';
import { router as dashboardRouter } from './routes/dashboard.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(helmet({
  contentSecurityPolicy: false // Allow inline scripts/styles for dev
}));
app.use(cors());
app.use(express.json({ limit: '2mb' }));

// API Routes
app.get('/health', (_req: Request, res: Response) => res.json({ ok: true }));

app.use('/api/collection', collectionRouter);
app.use('/api/processing', processingRouter);
app.use('/api/quality', qualityRouter);
app.use('/api/provenance', provenanceRouter);
app.use('/api/qrcode', qrcodeRouter);
app.use('/api/fabric-logs', fabricLogsRouter);
app.use('/api/dashboard', dashboardRouter);

// Serve static frontend apps
const publicDir = path.join(__dirname, '../public');

// Serve static assets with proper MIME types
const serveStatic = (route: string, dir: string) => {
  app.use(route, express.static(path.join(publicDir, dir), {
    maxAge: '1d',
    etag: true
  }));
  // Catch-all for SPA routing - must be after static files
  app.get(`${route}/*`, (_req: Request, res: Response) => {
    res.sendFile(path.join(publicDir, dir, 'index.html'));
  });
};

// Consumer Portal
serveStatic('/consumer', 'consumer');

// Collectors App
serveStatic('/collectors', 'collectors');

// Dashboard
serveStatic('/dashboard', 'dashboard');

// Fabric Logs Viewer
serveStatic('/logs', 'logs');

// Root redirects to dashboard
app.get('/', (_req: Request, res: Response) => {
  res.redirect('/dashboard');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`All services running on port ${PORT}`);
  console.log(`Dashboard:     http://localhost:${PORT}/dashboard`);
  console.log(`Consumer:     http://localhost:${PORT}/consumer`);
  console.log(`Collectors:   http://localhost:${PORT}/collectors`);
  console.log(`Fabric Logs:  http://localhost:${PORT}/logs`);
  console.log(`API:          http://localhost:${PORT}/api`);
});


