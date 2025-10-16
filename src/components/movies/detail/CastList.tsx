import { ResponseMovieCredits } from "@/types/movies";
import { Box, Stack } from "@mui/material";
import React from "react";
import Image from "next/image";

interface CastListProps {
  castsProps: ResponseMovieCredits[] | null;
}

function getCastExistImage(cast: ResponseMovieCredits) {
  if (cast.profile_path) {
    return cast;
  }
  return null;
}
// profile_pathが存在するキャストのみ抽出

function CastList({ castsProps }: CastListProps) {
  const casts = castsProps?.map(getCastExistImage).filter(Boolean) || [];

  return (
    <Stack direction="row" spacing={1} sx={{ overflowX: "auto" }}>
      {casts && casts.length > 0 ? (
        casts.map(
          (cast) =>
            cast && (
              <Box key={cast.id} sx={{ textAlign: "center", minWidth: 100 }}>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Box
                    sx={{
                      borderRadius: 25,
                      overflow: "hidden",
                      width: 75,
                      height: 75,
                      position: "relative",
                      aspectRatio: "3/4",
                    }}
                  >
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${cast.profile_path}`}
                      alt={cast.name}
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="(max-width: 900px) 100vw, 30vw"
                    />
                  </Box>
                </Box>
                <Box sx={{ fontSize: 12 }}>{cast.name}</Box>
              </Box>
            )
        )
      ) : (
        <Box>キャストデータがありません</Box>
      )}
    </Stack>
  );
}
export default CastList;
