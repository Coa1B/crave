import { buildApp } from "./app.js";

const port = Number(process.env.PORT ?? 3000);

buildApp().listen(port, () => {
  console.log(`Crave back end listening on http://localhost:${port}`);
});
