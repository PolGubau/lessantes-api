import type { SupabaseClient } from "@supabase/supabase-js";
import type { Announcement } from "../schemas/announcement";

export class AnnouncementService {
  constructor(private db: SupabaseClient) {}

  async list(festivalId: string, limit = 10) {
    const { data, error } = await this.db
      .from("announcements")
      .select("*")
      .eq("festival_id", festivalId)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return (data ?? []) as Announcement[];
  }
}
