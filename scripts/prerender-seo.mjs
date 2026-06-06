import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, '..', 'dist');
const seoFile = resolve(__dirname, '..', 'seo', 'routes.json');

const SITE = 'https://www.kytriq.com';
const ORG = 'Kytriq Technologies';

const { routes } = JSON.parse(readFileSync(seoFile, 'utf8'));
const baseHtml = readFileSync(join(distDir, 'index.html'), 'utf8');
const routeByPath = new Map(routes.map((r) => [r.path, r]));

const escapeAttr = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const escapeText = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const fullTitleOf = (title) =>
  title.includes('Kytriq') ? title : `${title} | ${ORG}`;

// Short, breadcrumb-friendly label for a route.
const shortName = (route) => route.title.split('|')[0].trim();

const buildHeadTags = ({ title, description, keywords, url }) => {
  const fullTitle = fullTitleOf(title);
  return [
    `<meta name="description" content="${escapeAttr(description)}">`,
    `<meta name="keywords" content="${escapeAttr(keywords)}">`,
    `<link rel="canonical" href="${escapeAttr(url)}">`,
    `<meta property="og:title" content="${escapeAttr(fullTitle)}">`,
    `<meta property="og:description" content="${escapeAttr(description)}">`,
    `<meta property="og:url" content="${escapeAttr(url)}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="${ORG}">`,
    `<meta property="og:image" content="${SITE}/assets/logo.png">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${escapeAttr(fullTitle)}">`,
    `<meta name="twitter:description" content="${escapeAttr(description)}">`,
    `<meta name="twitter:url" content="${escapeAttr(url)}">`,
    `<meta name="twitter:image" content="${SITE}/assets/logo.png">`,
  ].join('\n    ');
};

// Breadcrumb trail built from the path segments, resolving intermediate
// segments back to their route definitions where possible.
const buildBreadcrumb = (route) => {
  const items = [{ name: 'Home', url: `${SITE}/` }];
  if (route.path !== '/') {
    const segments = route.path.replace(/^\//, '').split('/');
    let acc = '';
    for (const seg of segments) {
      acc += `/${seg}`;
      const match = routeByPath.get(acc);
      items.push({
        name: match ? shortName(match) : seg.replace(/-/g, ' '),
        url: `${SITE}${acc}`,
      });
    }
  }
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
};

const buildWebPageLd = (route) => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: fullTitleOf(route.title),
  description: route.description,
  url: route.url,
  isPartOf: { '@type': 'WebSite', name: ORG, url: `${SITE}/` },
  publisher: { '@type': 'Organization', name: ORG, logo: `${SITE}/assets/logo.png` },
});

const buildStructuredData = (route) =>
  [buildWebPageLd(route), buildBreadcrumb(route)]
    .map(
      (obj) =>
        `<script type="application/ld+json">\n${JSON.stringify(obj, null, 2)}\n</script>`,
    )
    .join('\n    ');

// Crawl-friendly fallback content for non-JS user agents. Hidden from JS users
// because React replaces the #root contents on mount; sits in <noscript>.
const buildNoscript = (route) => {
  const links = routes
    .map((r) => `<li><a href="${escapeAttr(r.url)}">${escapeText(shortName(r))}</a></li>`)
    .join('');
  return `<noscript>
      <h1>${escapeText(shortName(route))}</h1>
      <p>${escapeText(route.description)}</p>
      <nav aria-label="Site"><ul>${links}</ul></nav>
    </noscript>`;
};

const renderRoute = (route) => {
  const fullTitle = fullTitleOf(route.title);

  let html = baseHtml.replace(
    /<title>[\s\S]*?<\/title>/,
    `<title>${escapeText(fullTitle)}</title>`,
  );

  const tags = `${buildHeadTags(route)}\n    ${buildStructuredData(route)}`;
  html = html.replace('</head>', `    ${tags}\n</head>`);

  // Inject noscript fallback content just after the root mount node.
  html = html.replace(
    '<div id="root"></div>',
    `<div id="root"></div>\n    ${buildNoscript(route)}`,
  );

  const relPath = route.path === '/' ? '' : route.path.replace(/^\//, '');
  const outDir = relPath ? join(distDir, relPath) : distDir;
  mkdirSync(outDir, { recursive: true });
  const outFile = join(outDir, 'index.html');
  writeFileSync(outFile, html);
  return outFile;
};

// Regenerate sitemap.xml from routes so <lastmod> is always fresh and in sync.
const writeSitemap = () => {
  const today = new Date().toISOString().slice(0, 10);
  const meta = {
    '/': { changefreq: 'weekly', priority: '1.0' },
    '/services': { changefreq: 'monthly', priority: '0.9' },
  };
  const body = routes
    .map((r) => {
      const m = meta[r.path] || { changefreq: 'monthly', priority: '0.8' };
      return `  <url>
    <loc>${escapeText(r.url)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${m.changefreq}</changefreq>
    <priority>${m.priority}</priority>
  </url>`;
    })
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
  writeFileSync(join(distDir, 'sitemap.xml'), xml);
  console.log(`  sitemap.xml -> ${routes.length} urls (lastmod ${today})`);
};

console.log('[prerender-seo] writing per-route HTML with canonical + structured data');
for (const route of routes) {
  const file = renderRoute(route);
  console.log(`  ${route.path.padEnd(24)} -> ${file.replace(distDir, 'dist')}`);
}
writeSitemap();
console.log(`[prerender-seo] done (${routes.length} routes)`);
