import { createServer } from "node:http";
import { buildApp } from "./app.js";
import { removeExpiredGroups } from "./groups.js";
import { attachLive } from "./live.js";

const port = Number(process.env.PORT ?? 3000);

const server = createServer(buildApp());
attachLive(server);

const CLEANUP_EVERY_MS = 10 * 60 * 1000;
setInterval(removeExpiredGroups, CLEANUP_EVERY_MS).unref();

server.listen(port, () => {
  console.log(`Crave back end listening on http://localhost:${port}`);
});
