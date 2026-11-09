import app from "vinext/server/fetch-handler";
import { Repository } from "./src/server/storage/repository";
/** Keep vinext's fetch handler; add only the scheduled retention purge. */
export default {
  ...app,
  scheduled(
    _controller: ScheduledController,
    env: Cloudflare.Env,
    context: ExecutionContext,
  ): void {
    context.waitUntil(new Repository(env.DB).cleanup(Date.now()));
  },
};
