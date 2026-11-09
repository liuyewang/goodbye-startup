/** The unmetered text proxy has been replaced by versioned simulation operations. */
export function POST(): Response {
  return Response.json(
    {
      error: "This endpoint has been retired.",
      code: "ENDPOINT_RETIRED",
      requestId: crypto.randomUUID(),
    },
    { status: 410, headers: { "Cache-Control": "no-store" } },
  );
}
