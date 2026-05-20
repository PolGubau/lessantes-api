import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import type { AppEnv } from "../env";
import { EventIdParamSchema, EventListQuerySchema, EventSchema } from "../schemas/event";
import { ErrorSchema, paginated, PaginationQuerySchema } from "../schemas/common";
import { getSupabase } from "../lib/supabase";
import { EventService } from "../services/event";

const events = new OpenAPIHono<AppEnv>();

const listRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Events"],
  summary: "List all events",
  description: "Retrieve a paginated list of festival events with optional filters.",
  request: {
    query: EventListQuerySchema.merge(PaginationQuerySchema),
  },
  responses: {
    200: {
      content: { "application/json": { schema: paginated(EventSchema) } },
      description: "List of events",
    },
  },
});

const getRoute = createRoute({
  method: "get",
  path: "/{id}",
  tags: ["Events"],
  summary: "Get event by ID",
  request: { params: EventIdParamSchema },
  responses: {
    200: {
      content: { "application/json": { schema: EventSchema } },
      description: "The event object",
    },
    404: {
      content: { "application/json": { schema: ErrorSchema } },
      description: "Event not found",
    },
  },
});

events.openapi(listRoute, async (c) => {
  const query = c.req.valid("query");
  const db = getSupabase(c.env);
  const service = new EventService(db);

  const { data, total } = await service.list(
    c.env.FESTIVAL_ID,
    query,
    query.limit,
    query.offset
  );

  return c.json({
    data,
    meta: {
      total,
      limit: query.limit,
      offset: query.offset,
      has_more: query.offset + query.limit < total,
    },
  });
});

events.openapi(getRoute, async (c) => {
  const { id } = c.req.valid("param");
  const db = getSupabase(c.env);
  const service = new EventService(db);

  const event = await service.findById(c.env.FESTIVAL_ID, id);
  if (!event) {
    return c.json(
      { error: { code: "not_found", message: `Event ${id} not found` } },
      404
    );
  }

  return c.json(event, 200);
});

export default events;
