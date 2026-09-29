const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const { Liquid } = require('liquidjs');

const root = path.resolve(__dirname, '..');
const engine = new Liquid({ root: path.join(root, 'snippets'), extname: '.liquid', strictFilters: true });
engine.registerFilter('json', JSON.stringify);
// Shopify owns this filter; local tests verify placement, not its schema implementation.
engine.registerFilter('structured_data', () => '{"shopifyNativeSchemaFixture":true}');
const defaults = {
  request: { page_type: 'index' },
  settings: { brand_name: 'BLICKLI' },
  shop: { name: 'BLICKLI', url: 'https://blickli.ch' },
  page_title: 'BLICKLI', page_description: '', current_page: 1,
  canonical_url: 'https://blickli.ch/',
};
async function render(overrides = {}) {
  const layout = readFileSync(path.join(root, 'layout/theme.liquid'), 'utf8');
  const source = layout.slice(layout.indexOf('>', layout.indexOf('<meta name="viewport"')) + 1,
    layout.indexOf('<link rel="preconnect"'));
  // These are Shopify globals, accessible inside an isolated render snippet.
  return engine.parseAndRender(source, {}, { globals: { ...defaults, ...overrides } });
}
const title = html => html.match(/<title>([\s\S]*?)<\/title>/)[1].trim();
const description = html => html.match(/<meta name="description" content="([^"]*)"/)?.[1];
const schemas = html => [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m => JSON.parse(m[1]));

test('homepage fallback identifies brand and products, with description and site identity', async () => {
  const html = await render();
  assert.equal(title(html), 'BLICKLI — Swiss Travel Posters &amp; Art Prints');
  assert.match(description(html), /Swiss travel posters/);
  assert.equal((html.match(/rel="canonical"/g) || []).length, 1);
  assert.match(html, /href="https:\/\/blickli.ch\/"/);
  assert.ok(schemas(html).some(s => s['@type'] === 'WebSite' && s.name === 'BLICKLI' && s.url === 'https://blickli.ch/'));
  assert.ok(schemas(html).some(s => s['@type'] === 'Organization' && s.name === 'BLICKLI'));
});
test('merchant homepage SEO overrides survive and brand is not repeated regardless of case', async () => {
  const html = await render({ page_title: 'Blickli | Swiss illustrations', page_description: 'Our "special" prints & places' });
  assert.equal(title(html), 'Blickli | Swiss illustrations');
  assert.equal(description(html).replaceAll('&#34;', '&quot;'), 'Our &quot;special&quot; prints &amp; places');
});
test('an unbranded merchant title gains the brand', async () => {
  assert.equal(title(await render({ page_title: 'Illustrated Swiss places' })), 'Illustrated Swiss places — BLICKLI');
});
test('default product title describes a poster and native product schema is included once', async () => {
  const html = await render({ request: { page_type: 'product' }, page_title: 'Engadin',
    product: { title: 'Engadin', description: '<p>Golden larches by the lake.</p>' }, canonical_url: 'https://blickli.ch/products/engadin' });
  assert.equal(title(html), 'Engadin Poster — BLICKLI');
  assert.equal(description(html), 'Golden larches by the lake.');
  assert.deepEqual(schemas(html), [{ shopifyNativeSchemaFixture: true }]);
  assert.match(html, /href="https:\/\/blickli.ch\/products\/engadin"/);
});
test('product custom titles and descriptions survive', async () => {
  const html = await render({ request: { page_type: 'product' }, page_title: 'Autumn in Engadin | BLICKLI',
    page_description: 'A hand-picked description.', product: { title: 'Engadin' } });
  assert.equal(title(html), 'Autumn in Engadin | BLICKLI');
  assert.equal(description(html), 'A hand-picked description.');
});
test('poster is not duplicated in an existing product title', async () => {
  const html = await render({ request: { page_type: 'product' }, page_title: 'Engadin POSTER', product: { title: 'Engadin POSTER' } });
  assert.equal(title(html), 'Engadin POSTER — BLICKLI');
});
test('an explicit SEO title equal to the product name stays unchanged', async () => {
  const html = await render({ request: { page_type: 'product' }, page_title: 'Engadin',
    product: { title: 'Engadin', metafields: { global: { title_tag: 'Engadin' } } } });
  assert.equal(title(html), 'Engadin — BLICKLI');
});
test('collection fallback and pagination do not override the canonical URL', async () => {
  const html = await render({ request: { page_type: 'collection' }, page_title: 'Posters',
    collection: { title: 'Posters', description: '' }, current_page: 2, canonical_url: 'https://blickli.ch/collections/posters?page=2' });
  assert.match(description(html), /Swiss travel posters/);
  assert.equal(title(html), 'Posters — Page 2 — BLICKLI');
  assert.match(html, /href="https:\/\/blickli.ch\/collections\/posters\?page=2"/);
  assert.equal(schemas(html).length, 0);
});
test('an existing collection description is used before a generic fallback', async () => {
  const html = await render({ request: { page_type: 'collection' }, page_title: 'Alpine places',
    collection: { title: 'Alpine places', description: '<p>A collection of alpine scenes.</p>' } });
  assert.equal(description(html), 'A collection of alpine scenes.');
});
test('HTML and JSON special characters cannot break metadata or script boundaries', async () => {
  const brand = 'A "brand" </script><script>alert(1)</script>';
  const html = await render({ settings: { brand_name: brand }, page_title: brand, shop: { name: brand },
    page_description: '"><script>alert(1)</script>' });
  assert.equal((html.match(/<script/g) || []).length, 2);
  assert.equal(schemas(html)[0].name, brand);
  assert.ok(!title(html).includes('<script>'));
  assert.ok(!description(html).includes('<script>'));
});
test('ordinary pages preserve titles without being labelled as products', async () => {
  const html = await render({ request: { page_type: 'page' }, page_title: 'The studio', page_description: 'About the studio.' });
  assert.equal(title(html), 'The studio — BLICKLI');
  assert.equal(schemas(html).length, 0);
});
