"use client";

import { ResponseMovieDetail, ResponseReleaseDates_release_dates } from "@/types/movies";
import React from "react";
import { useTheme } from "@mui/material/styles";
import Image from "next/image";
import { Box, Stack } from "@mui/material";
import Header1 from "@/components/common/header1";

interface MovieDetailProps {
  MovieDetail: ResponseMovieDetail | null;
  ReleaseInfoProps: ResponseReleaseDates_release_dates | null;
}

function DetailInfo({ MovieDetail, ReleaseInfoProps }: MovieDetailProps) {

  // 公開日
  const release_date = ReleaseInfoProps?.release_dates?.[0]?.release_date === null  ? "-" : ReleaseInfoProps?.release_dates?.[0]?.release_date;
  // 年齢制限
  const certification = ReleaseInfoProps?.release_dates?.[0]?.certification === null ? "-" : ReleaseInfoProps?.release_dates?.[0]?.certification;
  // 上映時間
  const runtime = MovieDetail?.runtime;

  return (
    <>
    <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
      {/* 画像コンテナ */}
      <Box
        sx={{
          position: 'relative',
          flexGrow: 0, // Stackにスペースが余っていても、拡大させない
          flexShrink: 0, // Stackにスペースが足りなくても、縮小させない
          flexBasis: '55%', // Stackの幅の55%
          aspectRatio: '1 / 1.5', // ポスターのアスペクト比を維持して、Boxの高さを確保
          mx: { xs: 'auto', md: 'unset' } 
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
      <Box sx={{ flex: 1, p: 2, minWidth: '30%'}}>
          <p>
            公開日:{" "}
            {release_date
              ? new Date(release_date).toLocaleDateString()
              : "不明"}
          </p>
          <p>年齢制限: {certification ?? "-"}</p>
          <p>上映時間: {runtime ?? "-"}</p>
      </Box>
    </Stack>
    </>
  );
}

export default DetailInfo;
