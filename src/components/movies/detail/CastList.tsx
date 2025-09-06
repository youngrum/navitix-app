import { ResponseMovieCredits } from "@/types/movies";
import { Box, Stack } from "@mui/material";
import React from "react";
import Image from "next/image";

interface CastListProps {
  castsProps: ResponseMovieCredits[] | [];
}

function CastList({ castsProps }: CastListProps) {
  return (
    <Stack direction="row" spacing={2} sx={{ overflowX: "auto", p: 2 }}>
      {castsProps.length > 0 ? (
        castsProps.map((cast) => (
          <Box key={cast.id}>
            <Box>{cast.name}</Box>
            <Box>{cast.character} 役</Box>
            <Box
              sx={{
                borderRadius: 4,
                overflow: "hidden",
                width: 100,
                height: 150,
                position: "relative",
              }}
            >
              <Image
                src={`https://image.tmdb.org/t/p/w500${cast.profile_path}`}
                alt={cast.name}
                fill
              />
            </Box>
          </Box>
        ))
      ) : (
        <Box>キャストデータがありません</Box>
      )}
    </Stack>
  );
}
export default CastList;
