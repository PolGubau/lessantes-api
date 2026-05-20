import { z } from "@hono/zod-openapi";

export const AnnouncementSeveritySchema = z.enum(["info", "warning", "critical"]);

export const AnnouncementSchema = z
  .object({
    id: z.string().uuid(),
    festival_id: z.string().openapi({ example: "les-santes-2026" }),
    title: z.string().openapi({ example: "Cercavila ajornada" }),
    message: z.string().nullable(),
    severity: AnnouncementSeveritySchema.openapi({ example: "info" }),
    event_id: z.string().nullable(),
    is_active: z.boolean().openapi({ example: true }),
    created_at: z.string().datetime(),
  })
  .openapi("Announcement");

export type Announcement = z.infer<typeof AnnouncementSchema>;
