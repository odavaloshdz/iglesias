import { supabase } from "@/lib/supabase";
import { Tables } from "@/types/supabase";

export type MassIntention = Tables<"mass_intentions">;
export type Priest = Tables<"priests">;

export const massIntentionService = {
  async getIntentions() {
    const { data, error } = await supabase
      .from("mass_intentions")
      .select("*, priests(name)")
      .order("start_date", { ascending: true });

    if (error) throw error;
    return data;
  },

  async getIntentionsByStatus(status: string) {
    const { data, error } = await supabase
      .from("mass_intentions")
      .select("*, priests(name)")
      .eq("status", status)
      .order("start_date", { ascending: true });

    if (error) throw error;
    return data;
  },

  async getIntentionsForToday() {
    const today = new Date().toISOString().split("T")[0];

    const { data, error } = await supabase
      .from("mass_intentions")
      .select("*, priests(name)")
      .eq("status", "pending")
      .or(
        `start_date.eq.${today},and(start_date.lte.${today},end_date.gte.${today})`,
      )
      .order("start_date", { ascending: true });

    if (error) throw error;
    return data;
  },

  async getIntentionById(id: string) {
    const { data, error } = await supabase
      .from("mass_intentions")
      .select("*, priests(name)")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  async createIntention(
    intention: Omit<
      Tables<"mass_intentions">["Insert"],
      "id" | "created_at" | "updated_at"
    >,
  ) {
    const { data, error } = await supabase
      .from("mass_intentions")
      .insert(intention)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateIntention(
    id: string,
    intention: Partial<Tables<"mass_intentions">["Update"]>,
  ) {
    const { data, error } = await supabase
      .from("mass_intentions")
      .update(intention)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteIntention(id: string) {
    const { error } = await supabase
      .from("mass_intentions")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return true;
  },

  async updateIntentionStatus(
    id: string,
    status: "pending" | "completed" | "cancelled",
  ) {
    const { data, error } = await supabase
      .from("mass_intentions")
      .update({
        status,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getPriests() {
    const { data, error } = await supabase
      .from("priests")
      .select("*")
      .eq("active", true)
      .order("name", { ascending: true });

    if (error) throw error;
    return data;
  },
};
