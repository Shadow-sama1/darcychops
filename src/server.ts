import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');
const ENQUIRY_RATE_WINDOW_MS = 15 * 60 * 1000;
const ENQUIRY_RATE_LIMIT = 5;
const enquiryRequests = new Map<string, number[]>();

const app = express();
const angularApp = new AngularNodeAppEngine();

app.post('/api/enquiry', express.json({ limit: '8kb' }), (req, res) => {
  if (process.env['ENABLE_ENQUIRY_API'] !== 'true') {
    res.sendStatus(404);
    return;
  }

  const now = Date.now();
  for (const [ip, timestamps] of enquiryRequests) {
    const recent = timestamps.filter((timestamp) => now - timestamp < ENQUIRY_RATE_WINDOW_MS);
    if (recent.length) enquiryRequests.set(ip, recent);
    else enquiryRequests.delete(ip);
  }

  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const timestamps = enquiryRequests.get(ip) ?? [];
  if (timestamps.length >= ENQUIRY_RATE_LIMIT) {
    res.status(429).json({ error: 'Too many enquiries. Please try again later.' });
    return;
  }

  timestamps.push(now);
  enquiryRequests.set(ip, timestamps);

  const body: unknown = req.body;
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    res.status(400).json({ error: 'Provide a name, phone number and message.' });
    return;
  }

  const record = body as Record<string, unknown>;
  const name = typeof record['name'] === 'string' ? record['name'].trim() : '';
  const phone = typeof record['phone'] === 'string' ? record['phone'].trim() : '';
  const message = typeof record['message'] === 'string' ? record['message'].trim() : '';
  if (
    name.length < 2 ||
    name.length > 80 ||
    !/^\+?[\d\s()-]{7,24}$/.test(phone) ||
    message.length < 5 ||
    message.length > 1200
  ) {
    res.status(400).json({ error: 'Enter a valid name, phone number and message.' });
    return;
  }

  console.info('[enquiry]', JSON.stringify({ name, phone, message }));
  res.status(202).json({ accepted: true });
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
