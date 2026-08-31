import { readdirSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, extname } from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import sharp from 'sharp';
import ffmpegPath from '@ffmpeg-installer/ffmpeg';

const execFileAsync = promisify(execFile);

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const journeyDir = resolve(rootDir, 'src/assets/images/journey');
const thumbsDir = resolve(journeyDir, 'thumbs');

mkdirSync(thumbsDir, { recursive: true });

const PHOTO_EXT = new Set(['.jpg', '.jpeg', '.png']);
const VIDEO_EXT = new Set(['.mov', '.mp4']);

const entries = readdirSync(journeyDir, { withFileTypes: true }).filter((e) => e.isFile());
const photos = entries.filter((e) => PHOTO_EXT.has(extname(e.name).toLowerCase()));
const videos = entries.filter((e) => VIDEO_EXT.has(extname(e.name).toLowerCase()) && extname(e.name).toLowerCase() !== '.mp4');

await Promise.all(
  photos.map(async (entry) => {
    const outName = entry.name.replace(/\.[^.]+$/, '.jpg');
    await sharp(resolve(journeyDir, entry.name))
      .rotate()
      .resize({ width: 320, withoutEnlargement: true })
      .jpeg({ quality: 75 })
      .toFile(resolve(thumbsDir, outName));
  })
);

await Promise.all(
  videos.map(async (entry) => {
    const inputPath = resolve(journeyDir, entry.name);
    const baseName = entry.name.replace(/\.[^.]+$/, '');

    // Poster frame (for grid thumbnails / preload previews) from 1s in.
    const { stdout } = await execFileAsync(
      ffmpegPath.path,
      ['-y', '-ss', '00:00:01', '-i', inputPath, '-vframes', '1', '-f', 'image2pipe', '-vcodec', 'mjpeg', '-'],
      { encoding: 'buffer', maxBuffer: 1024 * 1024 * 50 }
    );
    await sharp(stdout)
      .resize({ width: 320, withoutEnlargement: true })
      .jpeg({ quality: 75 })
      .toFile(resolve(thumbsDir, `${baseName}.jpg`));

    // .mov often reports as video/quicktime, which browsers other than Safari
    // won't play via <video> — losslessly remux the same H.264/AAC into an
    // .mp4 container (in thumbs/, alongside the poster) so it plays everywhere.
    if (extname(entry.name).toLowerCase() === '.mov') {
      await execFileAsync(ffmpegPath.path, [
        '-y',
        '-i', inputPath,
        '-c', 'copy',
        '-movflags', '+faststart',
        resolve(thumbsDir, `${baseName}.mp4`),
      ]);
    }
  })
);

console.log(`Generated ${photos.length} photo thumbnail(s) and ${videos.length} video poster(s)/remux(es) in src/assets/images/journey/`);
