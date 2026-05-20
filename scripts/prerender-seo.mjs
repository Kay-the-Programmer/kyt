import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, '..', 'dist');
const seoFile = resolve(__dirname, '..', 'seo', 'routes.json');

const { routes } = JSON.parse(readFileSync(seoFile, 'utf8'));
const baseHtml = readFileSync(join(distDir, 'index.html'), 'utf8');

const escapeAttr = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const escapeText = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const buildHeadTags = ({ title, description, keywords, url }) => {
  const fullTitle = title.includes('Kytriq') ? title : `${title} | Kytriq Technologies`;
  return [
    `<meta name="description" content="${escapeAttr(description)}">`,
    `<meta name="keywords" content="${escapeAttr(keywords)}">`,
    `<link rel="canonical" href="${escapeAttr(url)}">`,
    `<meta property="og:title" content="${escapeAttr(fullTitle)}">`,
    `<meta property="og:description" content="${escapeAttr(description)}">`,
    `<meta property="og:url" content="${escapeAttr(url)}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="Kytriq Technologies">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${escapeAttr(fullTitle)}">`,
    `<meta name="twitter:description" content="${escapeAttr(description)}">`,
    `<meta name="twitter:url" content="${escapeAttr(url)}">`,
  ].join('\n    ');
};

const renderRoute = (route) => {
  const fullTitle = route.title.includes('Kytriq')
    ? route.title
    : `${route.title} | Kytriq Technologies`;

  let html = baseHtml.replace(
    /<title>[\s\S]*?<\/title>/,
    `<title>${escapeText(fullTitle)}</title>`,
  );

  const tags = buildHeadTags(route);
  html = html.replace('</head>', `    ${tags}\n</head>`);

  const relPath = route.path === '/' ? '' : route.path.replace(/^\//, '');
  const outDir = relPath ? join(distDir, relPath) : distDir;
  mkdirSync(outDir, { recursive: true });
  const outFile = join(outDir, 'index.html');
  writeFileSync(outFile, html);
  return outFile;
};

console.log('[prerender-seo] writing per-route HTML with canonical tags');
for (const route of routes) {
  const file = renderRoute(route);
  console.log(`  ${route.path.padEnd(24)} -> ${file.replace(distDir, 'dist')}`);
}
console.log(`[prerender-seo] done (${routes.length} routes)`);
