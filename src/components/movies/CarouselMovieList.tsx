"use client";

import Slider from "react-slick";
import { Box, styled, Typography } from "@mui/material";
import Image from "next/image";
import { ResponseMovies } from "@/types/movies";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";

interface CarouselMovieListProps {
  movies: ResponseMovies[];
}

// カルーセルのドットをカスタマイズ
const StyledSlider = styled(Slider)(({ theme }) => ({
  "& .slick-dots": {
    bottom: "50px", // ドットの位置を調整
    "li button:before": {
      fontSize: "12px",
      color: "white", // ドットの色
    },
    "li.slick-active button:before": {
      color: theme.palette.secondary.main,
    },
  },
}));

export default function CarouselMovieList({ movies }: CarouselMovieListProps) {
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 5000,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false, // 矢印は非表示
  };

  return (
    <Box sx={{ maxWidth: 600, mt: 4 }}>
      <StyledSlider {...settings}>
        {movies.map((movie) => (
          <Link key={movie.id} href={`/movies/${movie.id}`}>
            <Box
              key={movie.id}
              sx={{
                borderRadius: "16px", // 画像の角を丸くする
                overflow: "hidden", // はみ出る部分を隠す
                height: "200px", // カルーセルの表示高さを固定
                position: "relative", // Imageコンポーネントでfillを使うために必要
                margin: "0 auto", // 中央揃え
              }}
            >
              <Image
                src={
                  !movie.poster_path
                    ? "/noPosterImage.png"
                    : `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                }
                alt={movie.title}
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
          </Link>
        ))}
      </StyledSlider>
    </Box>
  );
}
