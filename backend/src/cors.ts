// The web front end runs on a different address than this server (for example the
// Vite dev server, or a phone opening it over Wi-Fi), so browsers need CORS to allow it.
// Set CORS_ORIGIN to a comma-separated list of allowed origins when we deploy;
// left empty it allows any origin, which is fine for local development.
const configured = process.env.CORS_ORIGIN?.split(",")
  .map((o) => o.trim())
  .filter(Boolean);

export const corsOrigin: string[] | true = configured?.length ? configured : true;
