"use client";

import * as React from "react";
import { Box, Typography } from "@mui/material";
import { ResponseMovies } from "@/types/movies";
import Image from "next/image";
import { useTheme } from "@mui/material";
import Link from "next/link";

interface MovieListProps {
  movies: ResponseMovies[];
}

export default function MovieList({ movies }: MovieListProps) {
  const theme = useTheme(); // useThemeでテーマを取得 useThemeはCSRで使用可
  return (
    <Box
      sx={{
        // ここがポイント
        display: "flex", // 子要素をFlexアイテムにする
        overflowX: "auto", // 横方向にはみ出た場合にスクロールバーを表示
        gap: 2, // カード間の間隔を空ける
      }}
    >
      {movies.map((movie) => (
        <Link key={movie.id} href={`/movies/${movie.id}`}>
          <Box
            key={movie.id}
            sx={{
              width: 200, // 各カードの幅を固定
            }}
          >
            <Box
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                boxShadow: 3,
                height: 300,
                mb: 1,
              }}
            >
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={`${movie.title}`}
                width={200}
                height={300}
                priority={true}
              />
            </Box>
            <Typography
              variant="h5"
              sx={{ fontSize: "0.875rem", color: theme.palette.text.primary }}
            >
              {movie.title}
            </Typography>
          </Box>
        </Link>
      ))}
    </Box>
  );
}
