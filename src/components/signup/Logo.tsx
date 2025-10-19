"use client";

import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import Image from "next/image";

export default function LogoWithFade() {
  const [isMounted, setIsMounted] = useState(false);

  // コンポーネントがクライアント側でマウントされた後に状態を変更
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <Box
      sx={{
        position: "relative",
        margin: "4rem auto 1rem",
        width: "100%",
        maxWidth: "10rem",
        height: "10rem",
        maxHeight: "10rem",
        transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
        opacity: isMounted ? 1 : 0,
        transform: isMounted ? "translateY(0)" : "translateY(20px)",
      }}
    >
      <Image src="/logo.svg" fill alt="logoImage"></Image>
    </Box>
  );
}
