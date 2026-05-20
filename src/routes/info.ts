import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import type { AppEnv } from "../env";
import { DaySchema, FestivalSchema } from "../schemas/festival";
import { LocationSchema } from "../schemas/event";
import { AnnouncementSchema } from "../schemas/announcement";
import { ErrorSchema, FestivalIdQuerySchema } from "../schemas/common";
import { getSupabase } from "../lib/supabase";
import { FestivalService } from "../services/festival";
import { AnnouncementService } from "../services/announcement";

const info = new OpenAPIHono<AppEnv>();

const festivalsRoute = createRoute({
  method: "get",
  path: "/festivals",
  tags: ["Info"],
  summary: "List all festivals",
  description:
    "Discover every festival edition available in the database. Use the returned `id` as the `festival_id` query param on the rest of the endpoints.",
  responses: {
    200: {
      content: { "application/json": { schema: z.array(FestivalSchema) } },
      description: "All festival editions, newest first",
    },
  },
});

const festivalRoute = createRoute({
  method: "get",
  path: "/festival",
  tags: ["Info"],
  summary: "Get festival info",
  description:
    "Returns metadata for the festival matching `festival_id` (defaults to the current edition).",
  request: { query: FestivalIdQuerySchema },
  responses: {
    200: {
      content: { "application/json": { schema: FestivalSchema } },
      description: "Festival metadata",
    },
    404: {
      content: { "application/json": { schema: ErrorSchema } },
      description: "Festival not found",
    },
  },
});

const daysRoute = createRoute({
  method: "get",
  path: "/days",
  tags: ["Info"],
  summary: "List festival days",
  request: { query: FestivalIdQuerySchema },
  responses: {
    200: {
      content: { "application/json": { schema: z.array(DaySchema) } },
      description: "List of dates with event counts",
    },
  },
});

const locationsRoute = createRoute({
  method: "get",
  path: "/locations",
  tags: ["Info"],
  summary: "List all locations",
  request: { query: FestivalIdQuerySchema },
  responses: {
    200: {
      content: { "application/json": { schema: z.array(LocationSchema) } },
      description: "Unique locations used in the program",
    },
  },
});

const announcementsRoute = createRoute({
  method: "get",
  path: "/announcements",
  tags: ["Info"],
  summary: "Recent announcements",
  request: { query: FestivalIdQuerySchema },
  responses: {
    200: {
      content: { "application/json": { schema: z.array(AnnouncementSchema) } },
      description: "Active global announcements",
    },
  },
});

info.openapi(festivalsRoute, async (c) => {
  const db = getSupabase(c.env);
  const service = new FestivalService(db);
  const data = await service.listAll();
  return c.json(data);
});

info.openapi(festivalRoute, async (c) => {
  const { festival_id } = c.req.valid("query");
  const db = getSupabase(c.env);
  const service = new FestivalService(db);
  const data = await service.getFestival(festival_id ?? c.env.FESTIVAL_ID);
  if (!data) {
    return c.json(
      { error: { code: "not_found", message: "Festival not found" } },
      404
    );
  }
  return c.json(data, 200);
});

info.openapi(daysRoute, async (c) => {
  const { festival_id } = c.req.valid("query");
  const db = getSupabase(c.env);
  const service = new FestivalService(db);
  const data = await service.listDays(festival_id ?? c.env.FESTIVAL_ID);
  return c.json(data);
});

info.openapi(locationsRoute, async (c) => {
  const { festival_id } = c.req.valid("query");
  const db = getSupabase(c.env);
  const service = new FestivalService(db);
  const data = await service.listLocations(festival_id ?? c.env.FESTIVAL_ID);
  return c.json(data);
});

info.openapi(announcementsRoute, async (c) => {
  const { festival_id } = c.req.valid("query");
  const db = getSupabase(c.env);
  const service = new AnnouncementService(db);
  const data = await service.list(festival_id ?? c.env.FESTIVAL_ID);
  return c.json(data);
});

export default info;
