import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.cwd();
const srcDir = join(root, "src");
const errors = [];
const warnings = [];

function assert(condition, message) {
  if (!condition) errors.push(message);
}

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) return walk(path);
    return /\.(tsx|jsx)$/.test(entry) ? [path] : [];
  });
}

function lineNumberFor(source, offset) {
  return source.slice(0, offset).split("\n").length;
}

function parseAttributes(rawAttributes) {
  const attributes = new Map();
  const attrPattern = /([:@\w-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|\{([^{}]*)\}|([^\s"'=<>`]+)))?/g;
  for (const match of rawAttributes.matchAll(attrPattern)) {
    const [, rawName, doubleQuoted, singleQuoted, braced, unquoted] = match;
    const value = doubleQuoted ?? singleQuoted ?? braced ?? unquoted ?? "true";
    attributes.set(rawName, value.trim());
  }
  return attributes;
}

function textFromChildren(children) {
  return children
    .replace(/<[^>]+>/g, " ")
    .replace(/\{[^}]*\}/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractCtaUsages(source, file) {
  const usages = [];
  const paired = /<CTAButton\b([^>]*)>([\s\S]*?)<\/CTAButton>/g;
  for (const match of source.matchAll(paired)) {
    usages.push({
      file,
      line: lineNumberFor(source, match.index ?? 0),
      attributes: parseAttributes(match[1]),
      text: textFromChildren(match[2]),
    });
  }

  const selfClosing = /<CTAButton\b([^>]*)\/>/g;
  for (const match of source.matchAll(selfClosing)) {
    usages.push({
      file,
      line: lineNumberFor(source, match.index ?? 0),
      attributes: parseAttributes(match[1]),
      text: "",
    });
  }

  return usages;
}

const files = existsSync(srcDir) ? walk(srcDir) : [];
const ctas = files.flatMap((file) => extractCtaUsages(readFileSync(file, "utf8"), relative(root, file)));

assert(ctas.length > 0, "Expected at least one CTAButton usage to validate.");

for (const cta of ctas) {
  const location = `${cta.file}:${cta.line}`;
  const hasHref = cta.attributes.has("href");
  const hasOnClick = cta.attributes.has("onClick");
  const isDisabled = cta.attributes.has("disabled") && cta.attributes.get("disabled") !== "false";
  const ariaLabel = cta.attributes.get("ariaLabel") ?? cta.attributes.get("aria-label") ?? "";
  const visibleOrAccessibleText = `${cta.text} ${ariaLabel}`.trim();

  assert(hasHref || hasOnClick || isDisabled, `${location} CTAButton must have href, onClick, or disabled.`);
  assert(!(hasHref && hasOnClick), `${location} CTAButton must not mix href and onClick semantics.`);
  assert(visibleOrAccessibleText.length > 0, `${location} CTAButton must expose visible text or an aria label.`);

  if (isDisabled) {
    assert(!hasHref && !hasOnClick, `${location} disabled CTAButton must not also provide href or onClick.`);
    assert(/pending|unavailable|coming soon|disabled/i.test(visibleOrAccessibleText), `${location} disabled CTAButton must clearly say pending, unavailable, coming soon, or disabled.`);
  }

  if (hasHref) {
    const href = cta.attributes.get("href") ?? "";
    assert(!/^['"]?#/.test(href), `${location} href CTAButton should not use an empty/hash-only destination.`);
  }
}

const sourceText = files.map((file) => readFileSync(file, "utf8")).join("\n");
for (const term of ["Before You Run /agileteam", "Product Vision", "Product Canvas", "acceptance criteria", "evidence gates", "not done"]) {
  assert(sourceText.includes(term), `Install preflight content is missing required term: ${term}`);
}

if (!ctas.some((cta) => cta.attributes.has("disabled") && /pending|unavailable|coming soon|disabled/i.test(`${cta.text} ${cta.attributes.get("ariaLabel") ?? ""}`))) {
  warnings.push("No disabled/pending CTAButton was found; this is fine only if all advertised actions are live.");
}

if (errors.length > 0) {
  console.error("CTA integrity check failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

for (const warning of warnings) console.warn(`CTA integrity warning: ${warning}`);
console.log(`CTA integrity check passed (${ctas.length} CTAButton usages across ${files.length} TSX/JSX files).`);
