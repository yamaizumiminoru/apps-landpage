import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

export function createSiteServer(root) {
  const allowed = new Set(['index.html', '404.html', 'assets/style.css', 'assets/app.js', 'assets/guide.js', 'assets/favicon.svg']);
  const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml' };
  return createServer(async (req, res) => {
    const headers = { 'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'no-store' };
    if (!['GET', 'HEAD'].includes(req.method)) {
      res.writeHead(405, { ...headers, Allow: 'GET, HEAD' });
      res.end();
      return;
    }
    let path;
    try {
      path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    } catch {
      res.writeHead(400, headers);
      res.end('Bad request');
      return;
    }
    path = path.replace(/^\/apps-landpage(?=\/|$)/, '');
    let file = path === '' || path === '/' ? 'index.html' : path.replace(/^\//, '');
    const missing = !allowed.has(file);
    if (missing) file = '404.html';
    try {
      const content = await readFile(resolve(root, file));
      res.writeHead(missing ? 404 : 200, { ...headers, 'Content-Type': types[extname(file)], 'Content-Length': content.length });
      res.end(req.method === 'HEAD' ? undefined : content);
    } catch {
      res.writeHead(404, { ...headers, 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Page not found. Run npm run build before npm run preview.');
    }
  });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', process.argv[2] || '.');
  const port = Number(process.env.PORT || 4175);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT must be an integer from 1 to 65535.');
  const server = createSiteServer(root);
  server.on('error', error => { console.error(error.message); process.exitCode = 1; });
  server.listen(port, '127.0.0.1', () => console.log(`Language Labs: http://127.0.0.1:${port}/apps-landpage/`));
}
