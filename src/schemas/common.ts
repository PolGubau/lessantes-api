import { z } from "@hono/zod-openapi";

export const ErrorSchema = z
  .object({
    error: z.object({
      code: z.string().openapi({ example: "not_found" }),
      message: z.string().openapi({ example: "Resource not found" }),
    }),
  })
  .openapi("Error");

/**
 * Optional `festival_id` query param. When omitted, routes fall back to the
 * worker's default festival from `c.env.FESTIVAL_ID`. Documented as such so
 * Swagger users can discover and override it.
 */
export const FestivalIdQuerySchema = z.object({
  festival_id: z
    .string()
    .min(1)
    .optional()
    .openapi({
      param: { name: "festival_id", in: "query" },
      example: "les-santes-2026",
      description:
        "Festival identifier. Defaults to the current edition if omitted. Discover all available IDs via `GET /v1/festivals`.",
    }),
});

export const PaginationQuerySchema = z.object({
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(200)
    .default(50)
    .openapi({ example: 50, description: "Max items to return (1-200)." }),
  offset: z.coerce
    .number()
    .int()
    .min(0)
    .default(0)
    .openapi({ example: 0, description: "Items to skip." }),
});

export const PaginationMetaSchema = z
  .object({
    total: z.number().int().openapi({ example: 142 }),
    limit: z.number().int().openapi({ example: 50 }),
    offset: z.number().int().openapi({ example: 0 }),
    has_more: z.boolean().openapi({ example: true }),
  })
  .openapi("PaginationMeta");

export type PaginationMeta = z.infer<typeof PaginationMetaSchema>;

export function paginated<T extends z.ZodTypeAny>(item: T) {
  return z.object({
    data: z.array(item),
    meta: PaginationMetaSchema,
  });
}
