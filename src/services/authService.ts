import { supabase } from "@/lib/supabase";
import { Tables } from "@/types/supabase";

export type User = Tables<"users">;

export const authService = {
  async signIn(email: string, password: string) {
    // In a real app, this would use Supabase Auth
    // For this demo, we'll simulate authentication by checking if the user exists
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error) {
      throw new Error("Credenciales inválidas");
    }

    // In a real app, we would verify the password here
    // For demo purposes, we'll accept any password

    return data;
  },

  async signOut() {
    // In a real app, this would use Supabase Auth signOut
    // For this demo, we'll just return true
    return true;
  },

  async getCurrentUser() {
    // In a real app, this would use Supabase Auth getUser
    // For this demo, we'll check localStorage
    const userName = localStorage.getItem("userName");
    const userRole = localStorage.getItem("userRole");

    if (!userName || !userRole) {
      return null;
    }

    return {
      name: userName,
      role: userRole,
    };
  },
};
