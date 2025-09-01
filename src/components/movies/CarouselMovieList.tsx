"use client";

import React from "react";
import Slider from "react-slick";
import { Box, styled, Typography } from "@mui/material";
import Image from "next/image";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ResponseMovies } from "@/types/movies";

interface MovieListProps {
  movies: ResponseMovies[];
}

// カルーセルのドットをカスタマイズする
const StyledSlider = styled(Slider)(({ theme }) => ({
  "& .slick-dots": {
    bottom: "20px", // ドットの位置を調整
    "li button:before": {
      fontSize: "12px",
      color: "white", // ドットの色
    },
    "li.slick-active button:before": {
      color: theme.palette.secondary.main, // アクティブなドットの色
    },
  },
}));

export default function CarouselMovieList({ movies }: MovieListProps) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false, // 矢印は非表示
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "auto" }}>
      <StyledSlider {...settings}>
        {movies.map((movie) => (
          <Box
            key={movie.id}
            sx={{
              borderRadius: "16px", // 画像の角を丸くする
              overflow: "hidden", // はみ出る部分を隠す
              width: 400, // カルーセルの表示幅を固定 (Imageのwidthと一致させる)
              height: 300, // カルーセルの表示高さを固定 (Imageのheightと一致させる)
              position: "relative", // Imageコンポーネントでfillを使うために必要
              margin: "0 auto", // 中央揃え
            }}
          >
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              // width={400} // fillプロパティを使う場合はwidthとheightは不要
              // height={200}
              fill // 親要素のサイズに合わせて画像を拡大・縮小
              style={{ objectFit: "cover" }} // 画像をトリミングして親要素にフィットさせる
              priority={true}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                bgcolor: "rgba(0, 0, 0, 0.6)", // タイトル背景
                color: "white",
                p: 1,
                textAlign: "center",
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontSize: "0.875rem", fontWeight: "bold" }}
              >
                {movie.title}
              </Typography>
            </Box>
          </Box>
        ))}
      </StyledSlider>
    </Box>
  );
}
