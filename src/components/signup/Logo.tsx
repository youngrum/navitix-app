"use client";

import React, { useState, useEffect } from "react";
import { Box, Grow } from "@mui/material";
import Image from "next/image";

export default function LogoWithFade() {
  const [inProp, setInProp] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setInProp(true);
    });
  }, []);

  return (
    <Grow in={inProp} timeout={1000}>
      <Box
        sx={{
          position: "relative",
          margin: "4rem auto 1rem",
          width: "100%",
          maxWidth: "10rem",
          height: "10rem",
          maxHeight: "10rem",
          transition: inProp ? "none" : "transform 1s ease-out",
          transform: inProp ? "translateY(0)" : "translateY(20px)",
        }}
      >
        <Image src="/logo.svg" fill alt="logoImage"></Image>
      </Box>
    </Grow>
  );
}
