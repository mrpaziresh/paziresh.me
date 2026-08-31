import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const posts = JSON.parse(readFileSync(resolve(rootDir, 'src/app/data/posts.json'), 'utf-8'));

const routes = posts
  .filter((post) => post.published)
  .map((post) => `/notebook/${post.slug}`);

writeFileSync(resolve(rootDir, 'routes.txt'), routes.join('\n') + '\n');

console.log(`Wrote ${routes.length} route(s) to routes.txt`);
