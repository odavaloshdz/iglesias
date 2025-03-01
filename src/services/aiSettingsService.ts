import { supabase } from "@/lib/supabase";
import { Tables } from "@/types/supabase";

export type AISettings = Tables<"ai_settings">;

export const aiSettingsService = {
  async getSettings(userId: string) {
    const { data, error } = await supabase
      .from("ai_settings")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 is "no rows found"
      throw error;
    }

    // If no settings found, return default settings
    if (!data) {
      return {
        user_id: userId,
        default_model: "openai",
        openai_key: "",
        deepseek_key: "",
        auto_digitize: false,
        prompt_templates: {
          baptism:
            "Extrae la siguiente información del certificado de bautismo: nombre, apellidos, fecha de nacimiento, fecha de bautismo, lugar, padres, padrinos y ministro.",
          marriage:
            "Extrae la siguiente información del certificado de matrimonio: nombres y apellidos de los contrayentes, fecha, lugar, testigos y ministro.",
          communion:
            "Extrae la siguiente información del certificado de primera comunión: nombre, apellidos, fecha de nacimiento, fecha de comunión, lugar y ministro.",
          confirmation:
            "Extrae la siguiente información del certificado de confirmación: nombre, apellidos, fecha de nacimiento, fecha de confirmación, lugar, padrino/madrina y ministro.",
        },
        api_endpoints: {
          openai: "https://api.openai.com/v1",
          deepseek: "https://api.deepseek.com/v1",
        },
      };
    }

    return data;
  },

  async saveSettings(settings: Tables<"ai_settings">["Insert"]) {
    // Check if settings already exist for this user
    const { data: existingSettings } = await supabase
      .from("ai_settings")
      .select("id")
      .eq("user_id", settings.user_id)
      .single();

    if (existingSettings) {
      // Update existing settings
      const { data, error } = await supabase
        .from("ai_settings")
        .update(settings)
        .eq("id", existingSettings.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      // Create new settings
      const { data, error } = await supabase
        .from("ai_settings")
        .insert(settings)
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  },
};
