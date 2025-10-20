"use server";

import { createServerSupabaseClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function logout() {
  try {
    const supabase = await createServerSupabaseClient();
    //セッションを破棄
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout error:", error);
    }

    redirect("/signin");
  } catch (err) {
    console.error("Unexpected logout error:", err);
    redirect("/signin");
  }
}
