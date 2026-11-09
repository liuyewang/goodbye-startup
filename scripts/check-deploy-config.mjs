import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

// Check the generated artifact, since Vite chooses the environment at build time.
const config = JSON.parse(await readFile("dist/server/wrangler.json", "utf8"));
assert.equal(config.name, "goodbye-startup-production");
assert.equal(config.vars.APP_ENV, "production");
assert.equal(config.vars.AI_MODE, "deepseek");
assert.equal(config.vars.SITE_ORIGIN, "https://goodbye.help");
assert.equal(config.vars.AI_DAILY_CALL_LIMIT, "60");
assert.equal(config.d1_databases.length, 1);
assert.equal(config.d1_databases[0].binding, "DB");
assert.equal(
  config.d1_databases[0].database_id,
  "68f019ae-d303-4f2e-8374-e24a761515c2",
);
assert.equal(config.compatibility_date, "2025-09-01");
assert.ok(config.compatibility_flags.includes("nodejs_compat"));
assert.deepEqual(config.triggers.crons, ["0 3 * * *"]);
assert.ok(
  config.routes.length === 0 ||
    (config.routes.length === 1 &&
      config.routes[0].pattern === "goodbye.help" &&
      config.routes[0].custom_domain === true),
  "Production may only bind the approved apex domain",
);
assert.equal(config.preview_urls, false);
assert.equal(
  config.workers_dev,
  config.routes.length === 0,
  "Close the temporary endpoint when the canonical domain is bound",
);
for (const key of ["DEEPSEEK_API_KEY", "SESSION_SECRET"])
  assert.ok(!(key in config.vars), `${key} must remain a runtime secret`);
console.log("Production artifact uses the approved environment and database.");
