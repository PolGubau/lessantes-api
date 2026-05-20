import { z } from "@hono/zod-openapi";

export const ErrorSchema = z
  .object({
    error: z.object({
      code: z.string().openapi({ example: "not_found" }),
      message: z.string().openapi({ example: "Resource not found" }),
    }),
  })
  .openapi("Error");

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
