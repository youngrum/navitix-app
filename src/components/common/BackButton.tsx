"use client";

import React from "react";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { useRouter } from "next/navigation";

interface BackButtonProps {
  returnPath: string;
}

function BackButton({ returnPath }: BackButtonProps) {
  const router = useRouter();
  return <ArrowBackOutlinedIcon onClick={() => router.push(returnPath)} />;
}

export default BackButton;
