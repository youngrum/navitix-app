"use client";

import React from "react";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { useRouter } from "next/navigation";

interface BackButtonProps {
  returnPath: string;
}

export default function BackButton({ returnPath }: BackButtonProps) {
  const router = useRouter();
  return <ArrowBackOutlinedIcon onClick={() => router.push(returnPath)} />;
}
