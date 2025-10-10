import { createBrowserClient } from "@supabase/ssr";
import { createServerClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

// クライアントサイド用（ブラウザで使用）
export const createClient = () => {
  return createBrowserClient(supabaseUrl, supabasePublishableKey);
};

// サーバーサイド用（Server Components、Server Actions、Route Handlersで使用）
export const createSupabaseServerClient = async () => {
  // 動的import（サーバーサイドでのみ実行される）
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Server Componentではset/removeは無視される
        }
      },
    },
  });
};

// 後方互換性のため
export const supabase = createClient();
