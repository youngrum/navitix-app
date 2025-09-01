'use client';

import * as React from 'react';
import { Box, Typography } from '@mui/material';
import { NOW_PLAYING } from '@/types/movies';
import Image from 'next/image';

interface MovieListProps {
  movies: NOW_PLAYING[];
}

export default function PostsList({ movies }: MovieListProps) {
  return (
    <Box>
      {movies.map((movie) => (
        <Box key={movie.id} sx={{ my: 2, p: 2, border: '1px solid grey' }}>
          <Typography variant="h5">{movie.title}</Typography>
          <Image src={`${movie.poster_path}`} alt={`${movie.title}`} width={200} height={300} />
        </Box>
      ))}
    </Box>
  );
}