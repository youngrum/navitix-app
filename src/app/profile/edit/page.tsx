import BackButton from "@/components/common/BackButton";
import Header1 from "@/components/common/Header1";
import SubText from "@/components/common/SubText";
import ThemeProviderWrapper from "@/components/ThemeProviderWrapper";
import ProfileForm from "@/components/profile/ProfileForm";
import { Stack } from "@mui/material";
import SubmitButton from "@/components/common/SubmitButton";
import { requireAuth } from "@/lib/auth";

// Server Componentの引数で searchParams を受け取る
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  let header1Text = "";
  let subText = "";
  let submitText = "";

  // 'code'パラメータが存在すれば true
  const params = await searchParams;
  const hasAuthCode = !!params.code;

  const data = await requireAuth();
  console.log("ユーザー情報:", { user: data?.user?.email });

  if (hasAuthCode) {
    header1Text = "プロフィール登録";
    subText = "プロフィールを登録してください";
    submitText = "プロフィールを登録";
  } else {
    header1Text = "プロフィール修正";
    subText = "プロフィールを修正してください";
    submitText = "プロフィールを修正";
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
        <SubmitButton isLoading={false} buttonText={submitText} />
      </ThemeProviderWrapper>
    </main>
  );
}
