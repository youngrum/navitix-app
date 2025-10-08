import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });
  // console.log("request>>>>>>>>>>>>>>>", request);
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
  // console.log("supabase>>>>>>>>>>>>>>", supabase);

  // 認証メールからのリンクかチェック
  const url = request.nextUrl;
  console.log("url>>>>>>>>>>>>>>>>>>>>>>>>>", url);
  const hasAuthParams =
    url.searchParams.has("code") ||
    url.searchParams.has("token") ||
    url.searchParams.has("type") ||
    url.hash.includes("access_token");
  console.log("hasAuthParams>>>>>>>>>>>>>", hasAuthParams);

  // 認証メールからのアクセスの場合は、そのまま返す
  if (hasAuthParams) {
    return supabaseResponse;
  }

  // セッション取得
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthPage =
    request.nextUrl.pathname.startsWith("/signin") ||
    request.nextUrl.pathname.startsWith("/signup");
  const isProtectedPage = request.nextUrl.pathname.startsWith("/profile/edit");

  // 保護されたページへのアクセス
  if (isProtectedPage && !user) {
    const redirectUrl = new URL("/signin", request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // 認証済みユーザーが認証ページにアクセスした場合
  if (isAuthPage && user) {
    const redirectUrl = new URL("/", request.url);
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/password-reset",
    "/tickets/:path*",
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
