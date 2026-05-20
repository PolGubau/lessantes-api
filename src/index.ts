import { OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";
import { cors } from "hono/cors";
import { etag } from "hono/etag";
import type { AppEnv } from "./env";
import events from "./routes/events";
import info from "./routes/info";

const app = new OpenAPIHono<AppEnv>();

// Middlewares
app.use("*", cors());
app.use("*", etag());

// Routes
app.route("/v1/events", events);
app.route("/v1", info);

// OpenAPI spec
app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "Les Santes Open Data API",
    description:
      "Official Open Data API for the Les Santes festival in Mataró. Developed by Pol Gubau Amores.",
    contact: { name: "Pol Gubau Amores", url: "https://polgubau.com" },
    license: {
      name: "CC BY 4.0",
      url: "https://creativecommons.org/licenses/by/4.0/",
    },
  },
  servers: [
    { url: "https://api.lessantes.polgubau.com", description: "Production" },
    { url: "http://localhost:8787", description: "Local dev" },
  ],
});

// Swagger UI
app.get("/docs", swaggerUI({ url: "/doc" }));

// Landing
app.get("/", (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="ca">
  <head>
    <meta charset="utf-8" />
    <title>Les Santes API</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font-family: system-ui, sans-serif; line-height: 1.5; max-width: 720px; margin: 40px auto; padding: 0 20px; color: #1a1a1a; }
      code { background: #f4f4f4; padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }
      a { color: #e11d48; text-decoration: none; }
      a:hover { text-decoration: underline; }
      hr { border: 0; border-top: 1px solid #eee; margin: 32px 0; }
    </style>
  </head>
  <body>
    <h1>Les Santes Open Data API</h1>
    <p>API pública i gratuïta de dades obertes de Les Santes - Festa Major de Mataró.</p>
    <p>Documentació interactiva: <a href="/docs">/docs</a> · OpenAPI: <a href="/doc">/doc</a></p>
    <h2>Exemples</h2>
    <ul>
      <li><code>GET <a href="/v1/events">/v1/events</a></code> - tots els actes</li>
      <li><code>GET <a href="/v1/days">/v1/days</a></code> - dies de la festa</li>
      <li><code>GET <a href="/v1/locations">/v1/locations</a></code> - espais</li>
      <li><code>GET <a href="/v1/announcements">/v1/announcements</a></code> - avisos</li>
      <li><code>GET <a href="/v1/festival">/v1/festival</a></code> - informació general</li>
    </ul>
    <hr />
    <p><small>Desenvolupat per <a href="https://polgubau.com">Pol Gubau Amores</a>. Dades sota <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a> · Atribució obligatòria.</small></p>
  </body>
</html>`);
});

export default app;
