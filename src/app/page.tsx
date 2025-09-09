import ThemeProviderWrapper from "@/components/ThemeProviderWrapper";
import { Box } from "@mui/material";
import React from "react";
import Image from "next/image";
import Header1 from '@/components/common/header1';
import SubText from '@/components/common/SubText';
import SubmitButton from '../components/common/SubmitButton';
import SignInLeads from "@/components/common/SignInLeads";
import LinkButton from "@/components/common/LinkButton";

export default function Home() {
  const h1Title = "NaviTix"
  const subText = "Let's dive in into your account!"
  const buttonText = "アカウントを作成"
  const toCreateAccount = "/signUp"
  const toLogIn = "/login"
  const leadText ="アカウントを持っている方は"
  return (
    <main>
      <ThemeProviderWrapper>
        <Box
          sx={{
            position: "relative",
            margin: "4rem auto 1rem",
            width: "30vw",
            height: "20vh",
            minHeight: "15vh",
            maxHeight: "24vh",
          }}
        >
          <Image
            src="/logo.svg"
            fill
            alt="logoImage"
          ></Image>
        </Box>
        <Box sx={{display: "flex", justifyContent:"center"}}>
          <Header1 headerText={h1Title} />
        </Box>
        <Box sx={{display: "flex", justifyContent:"center", my: "2.5rem"}}>
          <SubText subText= {subText}/>
        </Box>
          <LinkButton toProps={toCreateAccount} buttonTextProps={buttonText}  />
          <SignInLeads toProps={toLogIn} leadTextProps={leadText} />
      </ThemeProviderWrapper>
    </main>
  );
}
