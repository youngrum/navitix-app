"use client";

import * as React from "react";
import { Box, Typography } from "@mui/material";
import { NOW_PLAYING } from "@/types/movies";
import Image from "next/image";
import { useTheme } from "@mui/material";

interface MovieListProps {
  movies: NOW_PLAYING[];
}

export default function MovieList({ movies }: MovieListProps) {
  const theme = useTheme(); // useThemeでテーマを取得 useThemeはCSRで使用可
  return (
    <Box>
      {movies.map((movie) => (
        <Box key={movie.id}>
          <Typography
            variant="h5"
            sx={{ fontSize: "1.25rem", color: theme.palette.text.primary }}
          >
            {movie.title}
          </Typography>
          <Image
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={`${movie.title}`}
            width={200}
            height={300}
            priority={true}
          />
        </Box>
      ))}
    </Box>
  );
}
