const fs = require('fs');
const path = require('path');

// Base URL of the website
const BASE_URL = 'https://sinochemi.com';

// Static routes
const staticRoutes = [
  '/',
  '/en',
  '/en/products',
  '/en/about',
  '/en/blog',
  '/en/contact',
];

// Function to extract slugs from data files
function getSlugs(filePath, regex) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const matches = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
      matches.push(match[1]);
    }
    return matches;
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return [];
  }
}

// Extract product slugs
const productSlugs = getSlugs(
  path.join(__dirname, '../src/data/products.ts'),
  /slug:\s*["'](.+?)["']/g
);

// Extract blog slugs
const blogSlugs = getSlugs(
  path.join(__dirname, '../src/data/blogs.ts'),
  /slug:\s*["'](.+?)["']/g
);

// Combine all routes
const allRoutes = [
  ...staticRoutes,
  ...productSlugs.map(slug => `/en/products/${slug}`),
  ...blogSlugs.map(slug => `/en/blog/${slug}`),
];

// Generate XML
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
  .map(route => `  <url>
    <loc>${BASE_URL}${route}</loc>
    <changefreq>weekly</changefreq>
    <priority>${route === '/' || route === '/en' ? '1.0' : '0.8'}</priority>
  </url>`)
  .join('\n')}
</urlset>`;

// Write to public directory
const outputPath = path.join(__dirname, '../public/sitemap.xml');
fs.writeFileSync(outputPath, sitemapXml);

console.log(`Sitemap generated successfully at ${outputPath}`);
console.log(`Total routes: ${allRoutes.length}`);
