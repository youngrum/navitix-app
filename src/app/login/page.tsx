import SigninForm from "@/components/auth/SigininForm";
import BackButton from "@/components/common/BackButton";
import Header1 from "@/components/common/Header1";
import SubText from "@/components/common/SubText";
import FadeInWrapper from "@/components/FadeInWrapper";
import ThemeProviderWrapper from "@/components/ThemeProviderWrapper";
import { Stack } from "@mui/material";
import React from "react";

export default function page() {
  const header1Text = "ログイン";
  const subText = "メールアドレスとパスワードを入力してログインしてください";

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
        <FadeInWrapper duration={800} delay={200}>
          <SubText subText={subText} />
          <SigninForm />
        </FadeInWrapper>
      </ThemeProviderWrapper>
    </main>
  );
}
