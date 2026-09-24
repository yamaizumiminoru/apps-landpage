import { mkdir, rm, copyFile, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = resolve(root, 'dist');
// Deliberate allowlist: docs, tests, .git, credentials and source notes never ship.
const files = ['index.html', '404.html', 'assets/style.css', 'assets/app.js', 'assets/guide.js', 'assets/favicon.svg'];
await rm(output, { recursive: true, force: true });
await mkdir(resolve(output, 'assets'), { recursive: true });
for (const file of files) await copyFile(resolve(root, file), resolve(output, file));
await writeFile(resolve(output, '.nojekyll'), '');
console.log(`Built ${files.length + 1} static files in dist/. No runtime dependencies or secrets.`);
