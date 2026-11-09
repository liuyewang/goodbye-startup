import { handle } from "@/src/server/http/api";
export function GET(request: Request): Promise<Response> {
  return handle(request, "session");
}
