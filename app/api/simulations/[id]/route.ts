import { handle } from "@/src/server/http/api";
type Context = { params: Promise<{ id: string }> };
export async function GET(
  request: Request,
  context: Context,
): Promise<Response> {
  return handle(request, "get", (await context.params).id);
}
export async function DELETE(
  request: Request,
  context: Context,
): Promise<Response> {
  return handle(request, "delete", (await context.params).id);
}
