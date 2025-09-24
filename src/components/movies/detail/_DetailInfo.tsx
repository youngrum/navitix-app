"use client";

import {
  _ResponseMovieDetail
} from "@/types/movies";
import React from "react";
import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import Image from "next/image";
import { Box, ButtonBase, Stack, Typography, Collapse } from "@mui/material";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";

interface MovieDetailInfoProps {
  MovieDetailProps: _ResponseMovieDetail | null;
}

export default function DetailInfo({
  MovieDetailProps,
}: MovieDetailInfoProps) {
  const theme = useTheme();
  const [isOverviewExpanded, setIsOverviewExpanded] = useState(false);

  const handleOverviewToggle = () => {
    setIsOverviewExpanded((prev) => !prev);
  };

  return (
    <>
      <Stack direction="row" spacing={1} sx={{ width: "100%" }}>
        {/* 画像コンテナ */}
        <Box
          sx={{
            borderRadius: "12px", // 画像の角を丸くする
            overflow: "hidden", // はみ出る部分を隠す
            position: "relative",
            flexGrow: 0, // Stackにスペースが余っていても、拡大させない
            flexShrink: 0, // Stackにスペースが足りなくても、縮小させない
            flexBasis: "55%", // Stackの幅の55%
            aspectRatio: "1 / 1.5", // ポスターのアスペクト比を維持して、Boxの高さを確保
            mx: { xs: "auto", md: "unset" }, //
          }}
        >
          <Image
            src={
              MovieDetailProps?.poster_path !== ""
                ? `https://image.tmdb.org/t/p/w500${MovieDetailProps?.poster_path}`
                : ""
            }
            alt={MovieDetailProps?.title ?? "タイトル不明"}
            fill // 親要素のBoxいっぱいに広がる
            sizes="(max-width: 900px) 100vw, 30vw" // 画像のサイズを最適化 900pxまでは親要素の幅いっぱいに広がりそれ以上は30vwに切り替わる
            style={{ objectFit: "cover" }} // ImageはNext由来なのでsx使用不可 アスペクト比を維持しつつ、Boxを埋める
          />
        </Box>

        {/* タイトルと詳細情報のコンテナ */}
        <Box sx={{ flex: 1, minWidth: "30%" }}>
          <Typography sx={{ fontSize: "18px", fontWeight: "bold", mb: "15px" }}>
            {MovieDetailProps?.title ?? "タイトル不明"}
          </Typography>
          <Typography
            sx={{
              fontSize: "14px",
              mb: "5px",
              color: theme.palette.text.secondary,
            }}
          >
            公開日:{" "}
            {MovieDetailProps?.release_date}
          </Typography>
          <Typography
            sx={{
              fontSize: "14px",
              mb: "5px",
              color: theme.palette.text.secondary,
            }}
          >
            上映時間: {MovieDetailProps?.runtime} min
          </Typography>
          <Typography
            sx={{
              fontSize: "14px",
              mb: "5px",
              color: theme.palette.text.secondary,
            }}
          >
            レーティング: {MovieDetailProps?.certification}
          </Typography>
          <Typography
            sx={{
              fontSize: "14px",
              mb: "5px",
              color: theme.palette.text.secondary,
            }}
          >
            ジャンル: {MovieDetailProps?.genres as string}
          </Typography>
        </Box>
      </Stack>
      <ButtonBase sx={{ width: "100%", mt: 4 }} onClick={handleOverviewToggle}>
        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{ width: "100%" }}
        >
          <Box>
            <Typography
              sx={{
                color: theme.palette.secondary.main,
                fontSize: 14,
                fontWeight: "bold",
              }}
            >
              解説・あらすじ
            </Typography>
          </Box>
          <ExpandMoreOutlinedIcon
            sx={{
              color: theme.palette.text.primary,
              fontSize: 32,
              fontWeight: "bold",
              pr: 1,
            }}
          />
        </Stack>
      </ButtonBase>
      <Collapse in={isOverviewExpanded}>
        <Box sx={{ mt: 1 }}>
          <Typography sx={{ mt: 1, fontSize: 14 }}>{MovieDetailProps?.overview}</Typography>
        </Box>
      </Collapse>
    </>
  );
}
