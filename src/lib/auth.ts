import { createServerSupabaseClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function requireAuth() {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.log("認証失敗、ログインページにリダイレクト");
    redirect("/login");
  }

  return data;
}
