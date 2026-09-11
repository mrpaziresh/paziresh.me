import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const posts = JSON.parse(readFileSync(resolve(rootDir, 'src/app/data/posts.json'), 'utf-8'));

// projects.data.ts is TypeScript, not JSON — pull out the slug values with a
// regex rather than dragging in a TS compiler just for this build script.
const projectsSource = readFileSync(resolve(rootDir, 'src/app/projects/projects.data.ts'), 'utf-8');
const projectSlugs = [...projectsSource.matchAll(/^\s*slug:\s*'([^']+)'/gm)].map((match) => match[1]);

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
const routes = [
  ...published.flatMap((post) => [`/notebook/${post.slug}`, `/n/${shortCode(post.slug)}`]),
  // Angular's prerender route discovery only finds unparameterized routes, so
  // `/projects/:slug` needs every concrete slug listed explicitly here too —
  // otherwise those pages are never prerendered and 404 on GitHub Pages.
  ...projectSlugs.map((slug) => `/projects/${encodeURIComponent(slug)}`),
];

writeFileSync(resolve(rootDir, 'routes.txt'), routes.join('\n') + '\n');

console.log(`Wrote ${routes.length} route(s) to routes.txt`);
