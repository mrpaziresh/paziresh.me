import { readdirSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, extname } from 'node:path';
import sharp from 'sharp';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const journeyDir = resolve(rootDir, 'src/assets/images/journey');
const thumbsDir = resolve(journeyDir, 'thumbs');

mkdirSync(thumbsDir, { recursive: true });

const PHOTO_EXT = new Set(['.jpg', '.jpeg', '.png']);

const files = readdirSync(journeyDir, { withFileTypes: true })
  .filter((entry) => entry.isFile() && PHOTO_EXT.has(extname(entry.name).toLowerCase()));

await Promise.all(
  files.map(async (entry) => {
    const outName = entry.name.replace(/\.[^.]+$/, '.jpg');
    await sharp(resolve(journeyDir, entry.name))
      .rotate()
      .resize({ width: 320, withoutEnlargement: true })
      .jpeg({ quality: 75 })
      .toFile(resolve(thumbsDir, outName));
  })
);

console.log(`Generated ${files.length} journey thumbnail(s) in src/assets/images/journey/thumbs/`);
