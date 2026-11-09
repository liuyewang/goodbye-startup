import { existsSync, writeFileSync } from "node:fs";
import { randomBytes } from "node:crypto";
if (existsSync(".dev.vars")) console.log("Existing .dev.vars preserved.");
else {
  writeFileSync(
    ".dev.vars",
    `APP_ENV=local\nAI_MODE=mock\nAI_DAILY_CALL_LIMIT=1000\nSITE_ORIGIN=http://127.0.0.1:5173\nSESSION_SECRET=${randomBytes(32).toString("hex")}\n`,
    { mode: 0o600 },
  );
  console.log(
    "Created ignored local mock configuration. No provider call is made.",
  );
}
