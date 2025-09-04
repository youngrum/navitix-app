"use client";

import { ResponseMovieDetail, ResponseReleaseDates_release_dates } from "@/types/movies";
import React from "react";
import { useTheme } from "@mui/material/styles";
import Image from "next/image";
import { Box, Stack, Typography } from "@mui/material";

interface MovieDetailProps {
  MovieDetail: ResponseMovieDetail | null;
  ReleaseInfoProps: ResponseReleaseDates_release_dates | null;
}

export default function DetailInfo({ MovieDetail, ReleaseInfoProps }: MovieDetailProps) {
    const theme = useTheme();
  
  // 年齢制限
  const certification = ReleaseInfoProps?.release_dates?.[0]?.certification === null ? "-" : ReleaseInfoProps?.release_dates?.[0]?.certification;
  // 公開日
  const release_date = MovieDetail?.release_date === null ? "-" : MovieDetail?.release_date;
  console.log(release_date);
  // 上映時間
  const runtime = MovieDetail?.runtime === null ? "-" : MovieDetail?.runtime;
  
  return (
    <>
    <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
      {/* 画像コンテナ */}
      <Box
        sx={{
          borderRadius: "12px", // 画像の角を丸くする
          overflow: "hidden", // はみ出る部分を隠す
          position: 'relative',
          flexGrow: 0, // Stackにスペースが余っていても、拡大させない
          flexShrink: 0, // Stackにスペースが足りなくても、縮小させない
          flexBasis: '55%', // Stackの幅の55%
          aspectRatio: '1 / 1.5', // ポスターのアスペクト比を維持して、Boxの高さを確保
          mx: { xs: 'auto', md: 'unset' } // 
        }}
      >
        <Image
          src={
            MovieDetail?.poster_path !== ""
              ? `https://image.tmdb.org/t/p/w500${MovieDetail?.poster_path}`
              : ""
          }
          alt={MovieDetail?.title ?? "タイトル不明"}
          fill // 親要素のBoxいっぱいに広がる
          sizes="(max-width: 900px) 100vw, 30vw" // 画像のサイズを最適化 900pxまでは親要素の幅いっぱいに広がりそれ以上は30vwに切り替わる
          style={{ objectFit: 'cover' }} // ImageはNext由来なのでsx使用不可 アスペクト比を維持しつつ、Boxを埋める
        />
      </Box>

      {/* タイトルと詳細情報のコンテナ */}
      <Box sx={{ flex: 1, minWidth: '30%'}}>
        <Typography sx={{fontSize:"18px", fontWeight:"bold", mb:"15px" }}>{MovieDetail?.title ?? "-"}</Typography>
          <Typography sx={{fontSize:"14px", mb:"5px", color: theme.palette.text.secondary }}>
            公開日:{" "}
            {release_date
              ? new Date(release_date).toLocaleDateString()
              : "不明"}
          </Typography>
          <Typography sx={{fontSize:"14px", mb:"5px", color: theme.palette.text.secondary }}>年齢制限: {certification ?? "-"}</Typography>
          <Typography sx={{fontSize:"14px", mb:"5px", color: theme.palette.text.secondary }}>上映時間: {runtime ?? "-"} min</Typography>
      </Box>
    </Stack>
    </>
  );
}
