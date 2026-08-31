import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const posts = JSON.parse(readFileSync(resolve(rootDir, 'src/app/data/posts.json'), 'utf-8'));

// Mirrors shortCode() in src/app/notebook/notebook.data.ts — keep the two in sync.
function shortCode(slug) {
  let hash = 2166136261;
  for (let i = 0; i < slug.length; i++) {
    hash ^= slug.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36).slice(0, 6);
}

const published = posts.filter((post) => post.published);
const routes = published.flatMap((post) => [`/notebook/${post.slug}`, `/n/${shortCode(post.slug)}`]);

writeFileSync(resolve(rootDir, 'routes.txt'), routes.join('\n') + '\n');

console.log(`Wrote ${routes.length} route(s) to routes.txt`);
