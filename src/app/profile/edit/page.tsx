import ProfileDisplay from "@/components/profile/ProfileDisplay";
import BackButton from "@/components/common/BackButton";
import Header1 from "@/components/common/Header1";
import SubText from "@/components/common/SubText";
import ThemeProviderWrapper from "@/components/ThemeProviderWrapper";
import { Stack } from "@mui/material";
import ProfileForm from "@/components/profile/ProfileForm";

export default function page() {
  const header1Text = "Edit Your Profile";
  const subText = "プロフィールを修正できます";

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
