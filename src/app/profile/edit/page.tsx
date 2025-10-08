import BackButton from "@/components/common/BackButton";
import Header1 from "@/components/common/Header1";
import SubText from "@/components/common/SubText";
import ThemeProviderWrapper from "@/components/ThemeProviderWrapper";
import ProfileForm from "@/components/profile/ProfileForm";
import { Stack } from "@mui/material";
import { createSupabaseServerClient } from "@/services/supabase";
import { redirect } from "next/navigation";

// Server Componentの引数で searchParams を受け取る
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const header1Text = "プロフィール修正";
  const subText = "プロフィールを修正できます";

  // Supabaseクライアントを作成（サーバーサイド用）
  const supabase = await createSupabaseServerClient();

  // 'code'パラメータが存在すれば true
  const params = await searchParams;
  const hasAuthCode = !!params.code;

  if (!hasAuthCode) {
    // 認証コードがない場合（通常のアクセス）のみセッションチェックを実行
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      // 認証済みセッションがない場合はリダイレクト
      redirect("/signin");
    }
  }

  return (
    <main>
      <ThemeProviderWrapper>
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          sx={{ marginBottom: "35px" }}
        >
          <BackButton returnPath="/" />
          <Header1 headerText={header1Text} />
        </Stack>
        <SubText subText={subText} />
        <ProfileForm />
      </ThemeProviderWrapper>
    </main>
  );
}
