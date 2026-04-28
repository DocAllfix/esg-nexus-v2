// One-shot seed runner: posta lo script SQL al management API endpoint
// /v1/projects/:ref/database/query usando l'access token.
//
// Uso: node scripts/run-seed.mjs

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SQL_PATH = join(__dirname, "..", "supabase", "seed_test_bilancio.sql");

const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN;
const PROJECT_REF = process.env.SUPABASE_PROJECT_REF || "mjerafarrifhijkelqfr";

if (!ACCESS_TOKEN) {
  console.error("Missing SUPABASE_ACCESS_TOKEN env var");
  process.exit(1);
}

const sql = readFileSync(SQL_PATH, "utf8");
const url = `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`;

const res = await fetch(url, {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${ACCESS_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ query: sql }),
});

const text = await res.text();
console.log("Status:", res.status);
console.log("Body:", text.slice(0, 2000));
if (!res.ok) process.exit(1);
