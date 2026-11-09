import assert from "node:assert/strict";

const base = process.env.TEST_BASE_URL;
assert.ok(base, "Set TEST_BASE_URL to the deployment being verified");
const origin = "https://goodbye.help";
const isCanonicalHost = new URL(base).origin === origin;
const health = await fetch(`${base}/api/health`, {
  signal: AbortSignal.timeout(30000),
});
assert.equal(health.status, 200);
assert.equal(health.headers.get("cache-control"), "no-store");
assert.deepEqual((await health.json()).data, {
  ready: true,
  mode: "production",
});
const session = await fetch(`${base}/api/session`, {
  signal: AbortSignal.timeout(30000),
});
assert.equal(session.status, 200);
assert.equal((await session.json()).data.ready, true);
const cookie = session.headers.get("set-cookie");
assert.ok(cookie);
for (const flag of ["HttpOnly", "Secure", "SameSite=Lax"])
  assert.ok(cookie.includes(flag));
// The staging hostname must reject writes even with the canonical Origin header.
// On the canonical host an invalid setup reaches validation, never the provider.
for (const [requestOrigin, status, code] of [
  ["https://invalid.example", 403, "FORBIDDEN_ORIGIN"],
  [
    origin,
    isCanonicalHost ? 400 : 403,
    isCanonicalHost ? "INVALID_INPUT" : "FORBIDDEN_ORIGIN",
  ],
]) {
  const response = await fetch(`${base}/api/simulations`, {
    method: "POST",
    headers: {
      Origin: requestOrigin,
      Cookie: cookie.split(";")[0],
      "Content-Type": "application/json",
    },
    body: "{}",
    signal: AbortSignal.timeout(30000),
  });
  assert.equal(response.status, status);
  assert.equal((await response.json()).code, code);
}
console.log(
  `Live readiness, D1/session and ${isCanonicalHost ? "canonical input validation" : "staging write rejection"} checks passed; no model call.`,
);
