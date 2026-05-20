import { z } from "@hono/zod-openapi";

export const EventTypeSchema = z.enum([
  "cercavila",
  "correfoc",
  "concert",
  "sardanes",
  "castellera",
  "gegants",
  "exposicio",
  "espectacle",
  "missa",
  "focsartificials",
  "cursa",
  "jocs",
  "contes",
  "barram",
  "altres",
]);

export const EventCategorySchema = z.enum([
  "familiar",
  "nocturn",
  "tradicional",
  "cultural",
]);

export const EventKindSchema = z.enum(["static", "mobile"]);

export const LocationSchema = z
  .object({
    name: z.string().nullable().openapi({ example: "Plaça de Santa Anna" }),
    lat: z.number().nullable().openapi({ example: 41.5388 }),
    lng: z.number().nullable().openapi({ example: 2.4449 }),
  })
  .openapi("Location");

export const RoutePointSchema = z
  .object({
    lat: z.number(),
    lng: z.number(),
    label: z.string().optional(),
  })
  .openapi("RoutePoint");

export const EventSchema = z
  .object({
    id: z.string().openapi({ example: "ls26-001" }),
    festival_id: z.string().openapi({ example: "les-santes-2026" }),
    title: z.string().openapi({ example: "Cercavila de Gegants" }),
    type: EventTypeSchema.openapi({ example: "cercavila" }),
    category: EventCategorySchema.openapi({ example: "familiar" }),
    kind: EventKindSchema.openapi({ example: "static" }),
    short_description: z
      .string()
      .openapi({ example: "Passejada dels gegants pel centre" }),
    start_time: z.string().datetime().openapi({ example: "2026-07-24T18:00:00Z" }),
    end_time: z.string().datetime().openapi({ example: "2026-07-24T20:00:00Z" }),
    image_url: z.string().url().nullable(),
    blurhash: z.string().nullable(),
    location: LocationSchema,
    route: z.array(RoutePointSchema).nullable(),
    is_cancelled: z.boolean().openapi({ example: false }),
    cancelled_reason: z.string().nullable(),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
  })
  .openapi("Event");

export type Event = z.infer<typeof EventSchema>;

export const EventListQuerySchema = z.object({
  day: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .openapi({
      param: { name: "day", in: "query" },
      example: "2026-07-24",
      description: "ISO date (YYYY-MM-DD). Filters events starting on this day (Europe/Madrid).",
    }),
  type: EventTypeSchema.optional().openapi({
    param: { name: "type", in: "query" },
  }),
  category: EventCategorySchema.optional().openapi({
    param: { name: "category", in: "query" },
  }),
  kind: EventKindSchema.optional().openapi({
    param: { name: "kind", in: "query" },
  }),
  q: z
    .string()
    .min(2)
    .max(80)
    .optional()
    .openapi({
      param: { name: "q", in: "query" },
      example: "gegants",
      description: "Full-text search on title and description.",
    }),
  from: z
    .string()
    .datetime()
    .optional()
    .openapi({
      param: { name: "from", in: "query" },
      description: "ISO datetime. Returns events with start_time >= from.",
    }),
  to: z
    .string()
    .datetime()
    .optional()
    .openapi({
      param: { name: "to", in: "query" },
      description: "ISO datetime. Returns events with start_time <= to.",
    }),
});

export const EventIdParamSchema = z.object({
  id: z
    .string()
    .min(1)
    .openapi({ param: { name: "id", in: "path" }, example: "ls26-001" }),
});
