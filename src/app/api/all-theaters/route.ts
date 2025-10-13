// src/app/api/all-theaters/route.ts
import { createPublicSupabaseClient } from "@/utils/supabase/public";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = createPublicSupabaseClient();
  const { data, error } = await supabase.from("theaters").select("*");
  if (error) {
    // エラーハンドリングを追加
    return NextResponse.json(
      { error: error.message },
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
  return NextResponse.json(data);
}
