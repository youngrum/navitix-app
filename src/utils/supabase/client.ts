import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

// クライアントサイド用（ブラウザで使用）
export const createClient = () => {
  return createBrowserClient(supabaseUrl, supabasePublishableKey);
};
// 後方互換性のため
export const supabase = createClient();
