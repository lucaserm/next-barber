import assert from "node:assert";
import { resolveLocale } from "./detect";

// Run with: npx tsx i18n/detect.test.ts
assert.equal(resolveLocale("en-US"), "en");
assert.equal(resolveLocale("pt-BR,pt;q=0.9"), "pt-br");
assert.equal(resolveLocale("pt-BR,pt;q=0.9,en;q=0.8"), "pt-br");
assert.equal(resolveLocale("fr-FR"), "en");
assert.equal(resolveLocale(null), "en");
assert.equal(resolveLocale(""), "en");

console.log("resolveLocale: all assertions passed");
