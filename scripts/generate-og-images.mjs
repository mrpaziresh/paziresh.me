import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const posts = JSON.parse(readFileSync(resolve(rootDir, 'src/app/data/posts.json'), 'utf-8'));

const fontsDir = resolve(rootDir, 'node_modules/@fontsource/poppins/files');
const fontRegular = readFileSync(resolve(fontsDir, 'poppins-latin-400-normal.woff'));
const fontSemibold = readFileSync(resolve(fontsDir, 'poppins-latin-600-normal.woff'));
const fontBold = readFileSync(resolve(fontsDir, 'poppins-latin-700-normal.woff'));

const WIDTH = 1200;
const HEIGHT = 630;
const GRID = 40;
const INK = '#12182b';
const MUTED = '#9aa0ab';
const BLUE = '#1564fc';

function titleFontSize(title) {
  if (title.length > 90) return 44;
  if (title.length > 60) return 52;
  return 64;
}

function buildTemplate(title, date) {
  const gridLines = [];
  for (let x = 0; x <= WIDTH; x += GRID) {
    gridLines.push({
      type: 'div',
      props: {
        style: {
          position: 'absolute',
          left: x,
          top: 0,
          width: 1,
          height: HEIGHT,
          backgroundColor: 'rgba(18,24,43,0.06)',
        },
      },
    });
  }
  for (let y = 0; y <= HEIGHT; y += GRID) {
    gridLines.push({
      type: 'div',
      props: {
        style: {
          position: 'absolute',
          left: 0,
          top: y,
          width: WIDTH,
          height: 1,
          backgroundColor: 'rgba(18,24,43,0.06)',
        },
      },
    });
  }

  return {
    type: 'div',
    props: {
      style: {
        width: WIDTH,
        height: HEIGHT,
        display: 'flex',
        position: 'relative',
        backgroundColor: '#ffffff',
        fontFamily: 'Poppins',
      },
      children: [
        ...gridLines,
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              left: 0,
              top: 0,
              width: WIDTH,
              height: HEIGHT,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '56px 64px',
            },
            children: [
              {
                type: 'div',
                props: {
                  style: { display: 'flex', flexDirection: 'row', alignItems: 'baseline', fontSize: 26, fontWeight: 700 },
                  children: [
                    { type: 'div', props: { style: { color: INK }, children: 'paziresh' } },
                    { type: 'div', props: { style: { color: BLUE }, children: '.' } },
                    { type: 'div', props: { style: { color: INK }, children: 'me' } },
                  ],
                },
              },
              {
                type: 'div',
                props: {
                  style: { display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 1040 },
                  children: [
                    {
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          fontSize: 20,
                          fontWeight: 600,
                          color: MUTED,
                          letterSpacing: 3,
                          textTransform: 'uppercase',
                        },
                        children: 'Notebook',
                      },
                    },
                    {
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          fontSize: titleFontSize(title),
                          fontWeight: 700,
                          color: INK,
                          lineHeight: 1.15,
                        },
                        children: title,
                      },
                    },
                  ],
                },
              },
              {
                type: 'div',
                props: {
                  style: { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 12 },
                  children: [
                    {
                      type: 'div',
                      props: {
                        style: { display: 'flex', width: 8, height: 8, borderRadius: 999, backgroundColor: BLUE },
                      },
                    },
                    {
                      type: 'div',
                      props: {
                        style: { display: 'flex', fontSize: 20, fontWeight: 500, color: '#6b7280' },
                        children: date,
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  };
}

async function generate(post) {
  const svg = await satori(buildTemplate(post.title, post.date), {
    width: WIDTH,
    height: HEIGHT,
    fonts: [
      { name: 'Poppins', data: fontRegular, weight: 400, style: 'normal' },
      { name: 'Poppins', data: fontSemibold, weight: 600, style: 'normal' },
      { name: 'Poppins', data: fontBold, weight: 700, style: 'normal' },
    ],
  });

  const resvg = new Resvg(svg);
  const png = resvg.render().asPng();

  const outDir = resolve(rootDir, 'public/og');
  mkdirSync(outDir, { recursive: true });
  writeFileSync(resolve(outDir, `${post.slug}.png`), png);
}

const published = posts.filter((post) => post.published);
await Promise.all(published.map(generate));

console.log(`Generated ${published.length} OG image(s) in public/og/`);
