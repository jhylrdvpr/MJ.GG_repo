import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

function normalizeEnvKey(key) {
  if (!key || typeof key !== 'string') return '';
  return key.trim().replace(/^["']|["']$/g, '').replace(/^\uFEFF/, '');
}

function riotApiProxyPlugin(apiKey) {
  return {
    name: 'riot-api-proxy',
    configureServer(server) {
      server.middlewares.use('/riot-api', async (req, res) => {
        const match = req.url?.match(/^\/([^/?]+)(\/.*)?$/);
        if (!match) {
          res.statusCode = 400;
          res.end(JSON.stringify({ status: { message: 'Invalid riot-api path', status_code: 400 } }));
          return;
        }

        if (!apiKey) {
          res.statusCode = 500;
          res.end(JSON.stringify({ status: { message: 'RIOT_API_KEY is not set in .env', status_code: 500 } }));
          return;
        }

        const host = match[1];
        const path = match[2] || '/';
        const query = req.url?.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
        const url = `https://${host}.api.riotgames.com${path}${query}`;

        try {
          const upstream = await fetch(url, {
            headers: { 'X-Riot-Token': apiKey },
          });
          const body = await upstream.text();
          res.statusCode = upstream.status;
          res.setHeader('Content-Type', upstream.headers.get('content-type') || 'application/json');
          res.end(body);
        } catch (error) {
          res.statusCode = 502;
          res.end(JSON.stringify({ status: { message: error.message, status_code: 502 } }));
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const riotApiKey = normalizeEnvKey(env.VITE_RIOT_API_KEY || env.RIOT_API_KEY || '');

  return {
    plugins: [react(), riotApiProxyPlugin(riotApiKey)],
    // Use relative paths for GitHub Pages compatibility. Change to '/REPO_NAME/' if you prefer absolute base.
    base: './',
  };
});
