# Les Santes Open Data API 🎡

Public, free, developer-focused API for **Les Santes — Festa Major de Mataró**.

Built with [Hono](https://hono.dev) on [Cloudflare Workers](https://workers.cloudflare.com), reading from a Supabase Postgres database.

## Base URL

Production: `https://api.lessantes.polgubau.com`

## Documentation

- Interactive Swagger UI: [`/docs`](https://api.lessantes.polgubau.com/docs)
- OpenAPI 3.0 spec: [`/doc`](https://api.lessantes.polgubau.com/doc)

## Endpoints

| Method | Path                       | Description                                                   |
| ------ | -------------------------- | ------------------------------------------------------------- |
| GET    | `/v1/events`               | List events (filters: `day`, `type`, `category`, `kind`, `q`) |
| GET    | `/v1/events/{id}`          | Get event by id                                               |
| GET    | `/v1/days`                 | Festival days with event counts                               |
| GET    | `/v1/locations`            | Unique locations used in the programme                        |
| GET    | `/v1/announcements`        | Active announcements                                          |
| GET    | `/v1/festival`             | Current festival metadata                                     |

## Licensing

- **Code**: [MIT](./LICENSE) — © Pol Gubau Amores
- **Data**: [CC BY 4.0](./DATA-LICENSE.md) — attribution to **Pol Gubau Amores** required

## Local development

```bash
pnpm install
cp .dev.vars.example .dev.vars   # add your Supabase URL + anon key
pnpm dev                          # http://localhost:8787
```

## Deploy

```bash
pnpm wrangler login
pnpm wrangler secret put SUPABASE_URL
pnpm wrangler secret put SUPABASE_ANON_KEY
pnpm deploy
```

The custom route `api.lessantes.polgubau.com/*` is configured in `wrangler.toml`. Make sure a DNS record for `api.lessantes` (CNAME, proxied) exists in the `polgubau.com` Cloudflare zone.

---

Made by [Pol Gubau Amores](https://polgubau.com).
