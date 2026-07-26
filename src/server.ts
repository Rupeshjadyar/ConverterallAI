import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

/* Serve static files from /browser */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  })
);

/* Serve assets folder (src/assets) */
const assetsPath = join(process.cwd(), 'src', 'assets');
app.use('/assets', express.static(assetsPath));

/* Expose home image directly for convenience */
const homeImagePath = join(process.cwd(), 'src', 'assets', 'images', 'home.png');
app.get('/home.png', (req, res) => {
  res.sendFile(homeImagePath);
});

/* Handle all other requests by rendering the Angular application. */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next()
    )
    .catch(next);
});

/* Start the server if this module is the main entry point or PM2. */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/* Request handler – used by Angular CLI or Firebase. */
export const reqHandler = createNodeRequestHandler(app);
