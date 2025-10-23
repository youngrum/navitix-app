import ProfileDisplay from "@/components/profile/ProfileDisplay";
import BackButton from "@/components/common/BackButton";
import Header1 from "@/components/common/Header1";
import SubText from "@/components/common/SubText";
import ThemeProviderWrapper from "@/components/ThemeProviderWrapper";
import { Stack } from "@mui/material";
import { requireAuth } from "@/lib/auth";
import { createServerSupabaseClient } from "@/utils/supabase/server";

export default async function page() {
  const header1Text = "Your Profile";
  const subText = "プロフィールを完成してください";
  // 既存のプロフィール情報を取得
  const data = await requireAuth();
  const userId = data.user?.id;
  const userEmail = data.user?.email;

  const supabase = await createServerSupabaseClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("name, birth_day")
    .eq("id", userId)
    .single();

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
        <ProfileDisplay userEmail={userEmail!} initialData={profile} />
      </ThemeProviderWrapper>
    </main>
  );
}
