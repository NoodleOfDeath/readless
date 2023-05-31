import express from 'express';

import { Summary } from '../api/v1/schema';
import { DBService } from '../services/db/DBService';

const SSL = process.env.SSL === 'true';
const BASE_DOMAIN = process.env.BASE_DOMAIN;
const BASE_URL = `${SSL ? 'https' : 'http'}://${BASE_DOMAIN}`;

export async function main() {

  await DBService.initTables();

  const app = express();

  app.get('/', (req, res) => {
    res.send('OK');
  });

  app.get('/:type/:id/:format?', async (req, res) => {

    const {
      type, id, format = 'summary', 
    } = req.params;

    if (type === 's') {

      const summary = await Summary.findOne({ where: { id } });

      if (!summary) {
        res.status(404).send('Not found');
        return;
      }
    
      res.header('Content-Type', 'text/html; charset=utf-8');
      res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.send(`
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta property="og:image" content="${summary?.imageUrl}" />
          <meta property="og:title" content="${summary?.title}" />
          <meta property="og:description" content="${summary?.shortSummary}" />
        </head>
        <body>
          <script type="text/javascript">
            window.onload = function() {
              window.location.href = '${BASE_URL}/read?s=${id}&f=${format}';
            }
          </script>
          <div style="display: flex; justify-content: center; align-items: center; height: 100vh;">
            <div style="font-size: 24px; font-weight: bold; text-align: center;">
              Redirecting to Readless...
            </div>
            <div style="font-size: 24px; font-weight: bold; text-align: center;">
              <a href="${BASE_URL}/read?s=${id}&f=${format}">Click here if you are not redirected.</a>
            </div>
          </div>
        </body>
      </html>
    `);
      return;
    }

    res.status(404).send('Not found');

  });

  app.listen(process.env.PORT, () => {
    console.log(`AppLink server started on port ${process.env.PORT}`);
  });

}

main();