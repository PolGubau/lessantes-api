import type { SupabaseClient } from "@supabase/supabase-js";
import type { z } from "zod";
import type { Event, EventListQuerySchema } from "../schemas/event";

type QueryParams = z.infer<typeof EventListQuerySchema>;

export class EventService {
  constructor(private db: SupabaseClient) {}

  async list(festivalId: string, params: QueryParams, limit = 50, offset = 0) {
    let query = this.db
      .from("events")
      .select("*", { count: "exact" })
      .eq("festival_id", festivalId)
      .eq("is_cancelled", false)
      .order("start_time", { ascending: true })
      .range(offset, offset + limit - 1);

    if (params.day) {
      query = query
        .gte("start_time", `${params.day}T00:00:00Z`)
        .lte("start_time", `${params.day}T23:59:59Z`);
    }

    if (params.type) query = query.eq("type", params.type);
    if (params.category) query = query.eq("category", params.category);
    if (params.kind) query = query.eq("kind", params.kind);
    if (params.from) query = query.gte("start_time", params.from);
    if (params.to) query = query.lte("start_time", params.to);

    if (params.q) {
      const term = params.q.replace(/[%_]/g, "");
      query = query.or(`title.ilike.%${term}%,short_description.ilike.%${term}%`);
    }

    const { data, error, count } = await query;
    if (error) throw error;

    return {
      data: (data ?? []).map(mapToEvent),
      total: count ?? 0,
    };
  }

  async findById(id: string): Promise<Event | null> {
    const { data, error } = await this.db
      .from("events")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) return null;
    return mapToEvent(data);
  }
}

function mapToEvent(row: Record<string, unknown>): Event {
  return {
    ...row,
    location: {
      name: (row.location_name as string | null) ?? null,
      lat: (row.location_lat as number | null) ?? null,
      lng: (row.location_lng as number | null) ?? null,
    },
    route: (row.route as Event["route"]) ?? null,
  } as Event;
}
