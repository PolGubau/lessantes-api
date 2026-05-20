import { z } from "@hono/zod-openapi";

export const FestivalSchema = z
  .object({
    id: z.string().openapi({ example: "les-santes-2026" }),
    name: z.string().openapi({ example: "Les Santes 2026" }),
    city: z.string().openapi({ example: "Mataró" }),
    year: z.number().int().openapi({ example: 2026 }),
    starts_on: z.string().openapi({ example: "2026-07-24" }),
    ends_on: z.string().openapi({ example: "2026-07-29" }),
    is_active: z.boolean().openapi({ example: true }),
  })
  .openapi("Festival");

export type Festival = z.infer<typeof FestivalSchema>;

export const FestivalIdParamSchema = z.object({
  id: z
    .string()
    .min(1)
    .openapi({ param: { name: "id", in: "path" }, example: "les-santes-2026" }),
});

export const DaySchema = z
  .object({
    date: z.string().openapi({ example: "2026-07-24" }),
    label: z.string().openapi({ example: "Divendres" }),
    event_count: z.number().int().openapi({ example: 18 }),
  })
  .openapi("Day");

export type Day = z.infer<typeof DaySchema>;
