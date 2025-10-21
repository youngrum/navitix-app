import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // const pathname = request.nextUrl.pathname;
  // 座席選択ページは認証必須
  // /theater/{theater_id}/screen/{auditorium_id}/seat/
  // const isSeatPage = /^\/theater\/[^\/]+\/screen\/[^\/]+\/seat/.test(pathname);

  // IMPORTANT: DO NOT REMOVE auth.getUser()

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (
    //認証できない かつ 認証必要ページへのアクセスの場合は/loginにリダイレクト
    !user &&
    request.nextUrl.pathname !== "/" &&
    !request.nextUrl.pathname.startsWith("/login") &&
    !request.nextUrl.pathname.startsWith("/signup") &&
    !request.nextUrl.pathname.startsWith("/auth") &&
    !request.nextUrl.pathname.startsWith("/error") &&
    !request.nextUrl.pathname.startsWith("/movies") &&
    request.nextUrl.pathname !== "/theater" &&
    !request.nextUrl.pathname.startsWith("/theater/**/screen") &&
    !(
      request.nextUrl.pathname.startsWith("/theater/") &&
      request.nextUrl.pathname.match(/^\/theater\/[^\/]+\/screen\/?$/) !== null
    )
  ) {
    // no user, potentially respond by redirecting the user to the login page
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
