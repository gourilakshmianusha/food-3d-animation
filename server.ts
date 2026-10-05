import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', restaurant: 'The Ember Table', timestamp: new Date().toISOString() });
  });

  // Robots.txt
  app.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    res.send(`User-agent: *\nAllow: /\nSitemap: https://theembertable.com/sitemap.xml\n`);
  });

  // Sitemap.xml
  app.get('/sitemap.xml', (req, res) => {
    res.type('application/xml');
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://theembertable.com/</loc><priority>1.0</priority></url>
  <url><loc>https://theembertable.com/menu</loc><priority>0.9</priority></url>
  <url><loc>https://theembertable.com/reservation</loc><priority>0.9</priority></url>
  <url><loc>https://theembertable.com/about</loc><priority>0.8</priority></url>
  <url><loc>https://theembertable.com/chefs</loc><priority>0.8</priority></url>
  <url><loc>https://theembertable.com/private-dining</loc><priority>0.8</priority></url>
  <url><loc>https://theembertable.com/gallery</loc><priority>0.7</priority></url>
  <url><loc>https://theembertable.com/blog</loc><priority>0.7</priority></url>
  <url><loc>https://theembertable.com/contact</loc><priority>0.7</priority></url>
</urlset>`);
  });

  // Check NODE_ENV
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: PORT,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`The Ember Table server active at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Server boot failed:', err);
  process.exit(1);
});
