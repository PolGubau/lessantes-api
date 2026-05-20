import type { SupabaseClient } from "@supabase/supabase-js";
import type { Festival, Day } from "../schemas/festival";

export class FestivalService {
  constructor(private db: SupabaseClient) {}

  async getFestival(id: string): Promise<Festival | null> {
    const { data, error } = await this.db
      .from("festivals")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return null;
    return data as Festival;
  }

  async listDays(festivalId: string): Promise<Day[]> {
    // Try RPC first; fall back to manual aggregation if not defined.
    const { data, error } = await this.db.rpc("get_festival_days", {
      p_festival_id: festivalId,
    });

    if (error) {
      const { data: events } = await this.db
        .from("events")
        .select("start_time")
        .eq("festival_id", festivalId);

      const daysMap = new Map<string, number>();
      events?.forEach((e) => {
        const startTime = e.start_time as string | undefined;
        if (!startTime) return;
        const date = startTime.split("T")[0];
        if (!date) return;
        daysMap.set(date, (daysMap.get(date) ?? 0) + 1);
      });

      return Array.from(daysMap.entries())
        .sort()
        .map(([date, count]) => ({
          date,
          label: this.getWeekday(date),
          event_count: count,
        }));
    }

    return data as Day[];
  }

  async listLocations(festivalId: string) {
    const { data, error } = await this.db
      .from("events")
      .select("location_name, location_lat, location_lng")
      .eq("festival_id", festivalId)
      .not("location_name", "is", null);

    if (error) throw error;

    const unique = new Map<string, { name: string; lat: number | null; lng: number | null }>();
    (data ?? []).forEach((l) => {
      const name = l.location_name as string;
      if (!unique.has(name)) {
        unique.set(name, {
          name,
          lat: (l.location_lat as number | null) ?? null,
          lng: (l.location_lng as number | null) ?? null,
        });
      }
    });

    return Array.from(unique.values());
  }

  private getWeekday(dateStr: string) {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("ca-ES", { weekday: "long" }).format(date);
  }
}
