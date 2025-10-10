import BackButton from "@/components/common/BackButton";
import Header1 from "@/components/common/Header1";
import SubText from "@/components/common/SubText";
import ThemeProviderWrapper from "@/components/ThemeProviderWrapper";
import ProfileForm from "@/components/profile/ProfileForm";
import { Stack } from "@mui/material";
import { requireAuth } from "@/lib/auth";
import { createServerSupabaseClient } from "@/utils/supabase/server";

// Server Componentの引数で searchParams を受け取る
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // 'code'パラメータが存在すれば true
  const params = await searchParams;
  const hasAuthCode = !!params.code;

  const data = await requireAuth();
  const userId = data.user?.id;
  const userEmail = data.user?.email;

  // 既存のプロフィール情報を取得
  const supabase = await createServerSupabaseClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("name, birth_day")
    .eq("id", userId)
    .single();

  const isNewUser = !profile || hasAuthCode;

  const header1Text = isNewUser ? "プロフィール登録" : "プロフィール修正";
  const subText = isNewUser
    ? "プロフィールを登録してください"
    : "プロフィールを修正してください";
  const submitText = isNewUser ? "プロフィールを登録" : "プロフィールを修正";

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
        <ProfileForm
          userId={userId!}
          userEmail={userEmail!}
          initialData={profile}
          submitText={submitText}
        />
      </ThemeProviderWrapper>
    </main>
  );
}
