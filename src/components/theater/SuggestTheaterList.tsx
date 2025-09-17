import { TheaterSearchResponse } from "@/types/thater";
import { Box, Typography } from "@mui/material";

interface theaterlistProps {
    theaterlist: TheaterSearchResponse[];
}

export default function SuggestTheaterList({ theaterlist }: theaterlistProps){

  return <>
    {theaterlist && theaterlist.length > 0 ? (
      theaterlist.map(
        (theater) => theater && (
          <Box key={theater.id}>
            {theater.name}
          </Box>
        )
      )
     ) : (
      <Typography>見つかりませんでした。</Typography>
     )}
    </>
}