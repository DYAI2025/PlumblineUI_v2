import { existsSync, readFileSync, statSync } from "node:fs";
import { extname, join } from "node:path";

const root = process.cwd();
const indexHtml = readFileSync(join(root, "index.html"), "utf8");
const robots = readFileSync(join(root, "public", "robots.txt"), "utf8");
const errors = [];
const assetExtensionPattern = /\.(png|jpg|jpeg|webp|svg|xml)$/i;

function assert(condition, message) {
  if (!condition) errors.push(message);
}

function parseAttributes(rawAttributes) {
  const attributes = new Map();
  const attrPattern = /([:@\w-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  for (const match of rawAttributes.matchAll(attrPattern)) {
    const [, rawName, doubleQuoted, singleQuoted, unquoted] = match;
    const value = doubleQuoted ?? singleQuoted ?? unquoted ?? "";
    attributes.set(rawName.toLowerCase(), value);
  }
  return attributes;
}

function extractElements(html, tagNames) {
  const tags = tagNames.join("|");
  const elementPattern = new RegExp(`<\\s*(${tags})\\b([^>]*)>`, "gi");
  return [...html.matchAll(elementPattern)].map((match) => ({
    tagName: match[1].toLowerCase(),
    attributes: parseAttributes(match[2]),
  }));
}

function publicPathFromUrl(url) {
  const parsed = new URL(url, "https://dyai2025.github.io");
  const marker = "/Plumbline/";
  const path = parsed.pathname.startsWith(marker)
    ? parsed.pathname.slice(marker.length)
    : parsed.pathname.replace(/^\//, "");
  return path || "index.html";
}

function isPublicAssetUrl(url) {
  return assetExtensionPattern.test(new URL(url, "https://dyai2025.github.io").pathname);
}

const htmlElements = extractElements(indexHtml, ["meta", "link", "script"]);
const assetUrls = htmlElements
  .flatMap(({ attributes }) => [attributes.get("content"), attributes.get("href"), attributes.get("src")])
  .filter((value) => value && isPublicAssetUrl(value));

for (const url of assetUrls) {
  const publicRel = publicPathFromUrl(url);
  const fullPath = join(root, "public", publicRel);
  assert(existsSync(fullPath), `Referenced public asset is missing: ${url} -> public/${publicRel}`);
  if (existsSync(fullPath)) {
    assert(statSync(fullPath).size > 0, `Referenced public asset is empty: public/${publicRel}`);
  }
}

const sitemapMatch = robots.match(/^Sitemap:\s*(\S+)$/im);
assert(Boolean(sitemapMatch), "public/robots.txt must declare a Sitemap URL");
if (sitemapMatch) {
  const sitemapRel = publicPathFromUrl(sitemapMatch[1]);
  const sitemapPath = join(root, "public", sitemapRel);
  assert(existsSync(sitemapPath), `Robots sitemap target is missing: public/${sitemapRel}`);
  if (existsSync(sitemapPath)) {
    const sitemap = readFileSync(sitemapPath, "utf8");
    assert(sitemap.trim().startsWith("<?xml"), "Sitemap must be XML, not an HTML fallback");
    assert(sitemap.includes("<urlset"), "Sitemap must include a urlset");
  }
}

const ogImageElement = htmlElements.find(({ attributes }) =>
  attributes.get("property") === "og:image" || attributes.get("name") === "og:image"
);
assert(Boolean(ogImageElement), "index.html must include og:image");
const ogImageUrl = ogImageElement?.attributes.get("content");
assert(Boolean(ogImageUrl), "og:image must include a content attribute");
if (ogImageUrl) {
  const ogRel = publicPathFromUrl(ogImageUrl);
  const ogPath = join(root, "public", ogRel);
  assert(existsSync(ogPath), `OG image target is missing: public/${ogRel}`);
  if (existsSync(ogPath)) {
    const bytes = readFileSync(ogPath);
    const ext = extname(ogPath).toLowerCase();
    if (ext === ".png") {
      assert(bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])), "OG image must be a PNG file, not an HTML fallback");
    } else if (ext === ".svg") {
      assert(bytes.toString("utf8", 0, 200).includes("<svg"), "OG image SVG must contain an svg root");
    }
  }
}

if (errors.length > 0) {
  console.error("Static asset integrity check failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Static asset integrity check passed (${assetUrls.length} referenced assets, sitemap, OG image).`);
