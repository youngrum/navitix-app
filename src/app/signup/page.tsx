import ThemeProviderWrapper from "@/components/ThemeProviderWrapper";
import { Box } from "@mui/material";
import React from "react";
import Header1 from "@/components/common/Header1";
import SubText from "@/components/common/SubText";
import SignInLeads from "@/components/common/SignInLeads";
import LinkButton from "@/components/common/LinkButton";
import Image from "next/image";
import FadeInWrapper from "@/components/FadeInWrapper";

export default function Home() {
  const h1Title = "NaviTix";
  const subText = "Let's dive in into your account!";
  const buttonText = "アカウントを作成";
  const toCreateAccount = "/signup/comfirm";
  const toLogIn = "/login";
  const leadText = "アカウントを持っている方は";
  return (
    <main>
      <ThemeProviderWrapper>
        <FadeInWrapper duration={800} delay={200}>
          <Box
            sx={{
              position: "relative",
              margin: "4rem auto 1rem",
              width: "100%",
              maxWidth: "10rem",
              height: "10rem",
              maxHeight: "10rem",
            }}
          >
            <Image src="/logo.svg" fill alt="logoImage" priority={true}></Image>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Header1 headerText={h1Title} />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center", my: "2.5rem" }}>
            <SubText subText={subText} />
          </Box>
          <LinkButton toProps={toCreateAccount} buttonTextProps={buttonText} />
          <SignInLeads
            toProps={toLogIn}
            leadTextProps={leadText}
            textAlignProps="center"
          />
        </FadeInWrapper>
      </ThemeProviderWrapper>
    </main>
  );
}
