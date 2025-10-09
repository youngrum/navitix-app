import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code"); // 認証コード
  const next = `profile/edit/?code=${code}`;

  if (code) {
    const supabase = await createClient();

    // 認証コードをセッションと交換
    // この呼び出し内で、セッション（トークン）が自動的にCookieに保存される
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    console.log("data>>>>>>>>>>>>>>>>>>>>>>>>>>", data);

    if (!error) {
      // 成功したら任意のページにリダイレクト
      return NextResponse.redirect(requestUrl.origin + next);
    }
  }

  // 失敗したらエラーページなどにリダイレクト
  return NextResponse.redirect(
    requestUrl.origin + "/login?error=Could not exchange code."
  );
}
