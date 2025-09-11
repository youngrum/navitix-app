import SignupForm from "@/components/auth/SignupForm";
import BackButton from "@/components/common/BackButton";
import Header1 from "@/components/common/Header1";
import SignInLeads from "@/components/common/SignInLeads";
import SubText from "@/components/common/SubText";
import ThemeProviderWrapper from "@/components/ThemeProviderWrapper";
import { Container, Divider, Stack } from "@mui/material";

export default function page() {
  const header1Text = "Create Account";
  const subText = "アカウントを作成してください";

  return (
    <main>
      <ThemeProviderWrapper>
        <Container>
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
        </Container>
      </ThemeProviderWrapper>
    </main>

  );
}