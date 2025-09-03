"use client";

import { ResponseMovieDetail } from "@/types/movies";
import React from "react";
import { useTheme } from "@mui/material/styles";
import Image from "next/image";
import { Box, Grid, Stack } from "@mui/material";

interface MovieDetailProps {
  MovieDetail: ResponseMovieDetail | null;
}

function DetailInfo({ MovieDetail }: MovieDetailProps) {
  return (
    <>
      <Stack direction="row" spacing={2}>
        <Box>
          <Image
            src={
              MovieDetail?.poster_path !== ""
                ? `https://image.tmdb.org/t/p/w500${MovieDetail?.poster_path}`
                : ""
            }
            alt={MovieDetail?.title ?? "タイトル不明"}
            width={300}
            height={450}
          />
        </Box>
        <Box>
          <>{MovieDetail?.title ?? "タイトル不明"}</>
        </Box>
      </Stack>
      <p>{MovieDetail?.overview ?? "概要情報がありません。"}</p>
    </>
  );
}

export default DetailInfo;
