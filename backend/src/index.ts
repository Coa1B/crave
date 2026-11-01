import { createServer } from "node:http";
import { buildApp } from "./app.js";
import { attachLive } from "./live.js";

const port = Number(process.env.PORT ?? 3000);

const server = createServer(buildApp());
attachLive(server);

server.listen(port, () => {
  console.log(`Crave back end listening on http://localhost:${port}`);
});
