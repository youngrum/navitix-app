import ThemeProviderWrapper from "@/components/ThemeProviderWrapper";
import { Box } from "@mui/material";
import React from "react";
import Image from "next/image";

export default function Home() {
  return (
    <main>
      <ThemeProviderWrapper>
        <Box
          sx={{
            position: "relative",
            margin: "0 auto",
            width: "35vw",
            height: "80vw",
            maxHeight: "10rem",
            paddingTop: "100px",
          }}
        >
          <Image
            src="/logo.svg"
            fill
            alt="logoImage"
            style={{ paddingTop: "10%" }}
          ></Image>
        </Box>
      </ThemeProviderWrapper>
    </main>
  );
}
