export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      documents: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          type: "baptism" | "marriage" | "communion" | "confirmation";
          number: string;
          book: string;
          page: string;
          date: string;
          church: string;
          priest: string;
          notes: string | null;
          status: "active" | "archived";
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          type: "baptism" | "marriage" | "communion" | "confirmation";
          number: string;
          book: string;
          page: string;
          date: string;
          church: string;
          priest: string;
          notes?: string | null;
          status?: "active" | "archived";
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          type?: "baptism" | "marriage" | "communion" | "confirmation";
          number?: string;
          book?: string;
          page?: string;
          date?: string;
          church?: string;
          priest?: string;
          notes?: string | null;
          status?: "active" | "archived";
        };
      };
      people: {
        Row: {
          id: string;
          document_id: string;
          name: string;
          surname: string;
          birth_date: string;
          birth_place: string;
          role: string | null;
        };
        Insert: {
          id?: string;
          document_id: string;
          name: string;
          surname: string;
          birth_date: string;
          birth_place: string;
          role?: string | null;
        };
        Update: {
          id?: string;
          document_id?: string;
          name?: string;
          surname?: string;
          birth_date?: string;
          birth_place?: string;
          role?: string | null;
        };
      };
      mass_intentions: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          name: string;
          surname: string;
          start_date: string;
          end_date: string | null;
          intention: string;
          priest_id: string;
          notes: string | null;
          status: "pending" | "completed" | "cancelled";
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          name: string;
          surname: string;
          start_date: string;
          end_date?: string | null;
          intention: string;
          priest_id: string;
          notes?: string | null;
          status?: "pending" | "completed" | "cancelled";
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          name?: string;
          surname?: string;
          start_date?: string;
          end_date?: string | null;
          intention?: string;
          priest_id?: string;
          notes?: string | null;
          status?: "pending" | "completed" | "cancelled";
        };
      };
      priests: {
        Row: {
          id: string;
          name: string;
          active: boolean;
        };
        Insert: {
          id?: string;
          name: string;
          active?: boolean;
        };
        Update: {
          id?: string;
          name?: string;
          active?: boolean;
        };
      };
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          role: "admin" | "secretary" | "priest";
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          role?: "admin" | "secretary" | "priest";
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          role?: "admin" | "secretary" | "priest";
          created_at?: string;
        };
      };
      ai_settings: {
        Row: {
          id: string;
          user_id: string;
          default_model: string;
          openai_key: string | null;
          deepseek_key: string | null;
          auto_digitize: boolean;
          prompt_templates: Json;
          api_endpoints: Json;
        };
        Insert: {
          id?: string;
          user_id: string;
          default_model?: string;
          openai_key?: string | null;
          deepseek_key?: string | null;
          auto_digitize?: boolean;
          prompt_templates?: Json;
          api_endpoints?: Json;
        };
        Update: {
          id?: string;
          user_id?: string;
          default_model?: string;
          openai_key?: string | null;
          deepseek_key?: string | null;
          auto_digitize?: boolean;
          prompt_templates?: Json;
          api_endpoints?: Json;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      document_type: "baptism" | "marriage" | "communion" | "confirmation";
      document_status: "active" | "archived";
      intention_status: "pending" | "completed" | "cancelled";
      user_role: "admin" | "secretary" | "priest";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;
