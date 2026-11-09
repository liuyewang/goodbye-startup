import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync } from "node:fs";
const files = execFileSync("git", ["ls-files", "-z"], { encoding: "utf8" })
  .split("\0")
  .filter(Boolean);
function scanDir(dir) {
  if (!existsSync(dir)) return;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = dir + "/" + e.name;
    if (e.isDirectory()) scanDir(p);
    else files.push(p);
  }
}
scanDir("dist/client");
let failed = false;
for (const file of files) {
  if (!existsSync(file) || /\.(png|jpg|woff2?|ico|zip)$/.test(file)) continue;
  const text = readFileSync(file, "utf8");
  if (
    /sk-[a-zA-Z0-9]{28,}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/.test(
      text,
    )
  ) {
    console.error("Potential secret in", file);
    failed = true;
  }
}
if (
  files.some(
    (f) =>
      (/^\.env(?:\.|$)/.test(f) && f !== ".env.example") ||
      (/^\.dev\.vars/.test(f) && f !== ".dev.vars.example"),
  )
) {
  console.error("A local environment file is tracked");
  failed = true;
}
if (failed) process.exitCode = 1;
else
  console.log(
    "Tracked files and client bundle passed the secret-pattern check.",
  );
