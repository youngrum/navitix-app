import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = `/profile/edit?code=${code}`;

  if (code) {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          },
        },
      }
    );

    // 認証コードをセッションに交換
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // 成功したら指定されたページにリダイレクト
      return NextResponse.redirect(new URL(next, request.url));
    }

    console.error("認証コード交換エラー:", error);
  }

  // エラーの場合はログインページにリダイレクト
  return NextResponse.redirect(
    new URL("/login?error=authentication_failed", request.url)
  );
}
