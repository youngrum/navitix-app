import BackButton from "@/components/common/BackButton";
import Header1 from "@/components/common/header1";
import SubText from "@/components/common/SubText";
import ThemeProviderWrapper from "@/components/ThemeProviderWrapper";
import { Box, Container, Stack, Divider } from "@mui/material";
import InputEmailArea from '@/components/common/InputEmailArea';
import InputPasswordArea from "@/components/common/InputPasswordArea";
import SignInLeads from "@/components/common/SignInLeads";
import SubmitButton from '../../components/common/SubmitButton';

export default function page () {
  const header1Text = "Create Account"
  const subText = "アカウントを作成してください"
  const leadText = "アカウントをお持ちの方は"
  const toLogIn = "/login"
  const submitText = "アカウント作成"

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
          <SubText subText= {subText}/>
          <Box sx={{ mt: "50px" }}>
            <InputEmailArea/>
          </Box>
          <Box sx={{ mt: "50px" }}>
            <InputPasswordArea/>
          </Box>
          <Box>
            <SignInLeads leadTextProps={ leadText } toProps={toLogIn}/>
          </Box>
          <Divider />
          <SubmitButton isLoading={false} buttonText={submitText} />
          </Container>
        </ThemeProviderWrapper>
      </main>
    );
}