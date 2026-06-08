import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const app = readFileSync(join(root, "src", "App.tsx"), "utf8");
const errors = [];

function assert(condition, message) {
  if (!condition) errors.push(message);
}

assert(!app.includes("Launch Agent Explorer"), 'CTA label "Launch Agent Explorer" must not be used unless it opens a real explorer.');
assert(app.includes("View Machine Room"), 'Install CTA should honestly say "View Machine Room" when it scrolls to the machine section.');

const sponsorLabels = ["Support", "SUPPORT CORE", "Partner"];
for (const label of sponsorLabels) {
  const misleadingPattern = new RegExp(`<CTAButton[^>]*href=\\"https://github\\.com/DYAI2025/Plumbline\\"[^>]*>\\s*${label}\\s*</CTAButton>`, "m");
  assert(!misleadingPattern.test(app), `Sponsor CTA "${label}" must not route to GitHub as if it were a sponsor checkout.`);
}

const pendingCount = (app.match(/Sponsor link pending|Partner link pending/g) || []).length;
assert(pendingCount >= 3, "Sponsor CTAs must be visibly marked pending until real sponsor URLs exist.");
assert(app.includes("Payment links are pending"), "Sponsor disclaimer must state that payment links are pending.");

const preflightTerms = [
  "Before You Run /agileteam",
  "Do not start with coding",
  "Product Vision",
  "Product Canvas",
  "acceptance criteria",
  "evidence gates",
  "not done",
];
for (const term of preflightTerms) {
  assert(app.includes(term), `Install preflight is missing required term: ${term}`);
}

if (errors.length > 0) {
  console.error("CTA integrity check failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("CTA integrity check passed (honest labels, pending sponsor CTAs, /agileteam preflight). ");
