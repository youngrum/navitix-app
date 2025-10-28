import SignupForm from "@/components/auth/SignupForm";
import BackButton from "@/components/common/BackButton";
import Header1 from "@/components/common/Header1";
import SubText from "@/components/common/SubText";
import FadeInWrapper from "@/components/FadeInWrapper";
import ThemeProviderWrapper from "@/components/ThemeProviderWrapper";
import { Stack } from "@mui/material";

export default function page() {
  const header1Text = "Create Account";
  const subText = "アカウントを作成してください";

  return (
    <main>
      <ThemeProviderWrapper>
        <FadeInWrapper duration={800} delay={200}>
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
          <SignupForm />
        </FadeInWrapper>
      </ThemeProviderWrapper>
    </main>
  );
}
