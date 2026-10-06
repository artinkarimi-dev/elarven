import { access, cp } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, '.next', 'standalone');
const server = path.join(output, 'server.js');
try {
  await access(server);
} catch {
  throw new Error('Production output is missing. Run npm run build before npm run start.');
}
// Next's standalone output omits these assets; copy only into generated build output.
await cp(path.join(root, 'public'), path.join(output, 'public'), { recursive: true });
await cp(path.join(root, '.next', 'static'), path.join(output, '.next', 'static'), {
  recursive: true,
});
process.env.HOSTNAME = process.env.ELARVEN_HOST || '0.0.0.0';
await import(pathToFileURL(server).href);
