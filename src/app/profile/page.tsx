import ProfileDisplay from "@/components/profile/ProfileDisplay";
import BackButton from "@/components/common/BackButton";
import Header1 from "@/components/common/Header1";
import SubText from "@/components/common/SubText";
import ThemeProviderWrapper from "@/components/ThemeProviderWrapper";
import { Stack } from "@mui/material";

export default function page() {
  const header1Text = "Your Profile";
  const subText = "プロフィールを完成させてください。";

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
        <ProfileDisplay />
      </ThemeProviderWrapper>
    </main>
  );
}
