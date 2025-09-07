import { ResponseMovieDetail } from "@/types/movies";
import { Box, Rating, Stack, Typography } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import React from "react";

interface RatingStarProps {
  MovieDetailProps: ResponseMovieDetail | null;
}

// 10点満点の評価を5点満点に変換する関数
const convertToFiveStar = (voteAverage: number) => {
  return voteAverage / 2;
};

const getVoteCount = (MovieDetailProps: ResponseMovieDetail | null) => {
  return MovieDetailProps?.vote_count ?? 0;
};

function RatingStar({ MovieDetailProps }: RatingStarProps) {
  const voteAverage = MovieDetailProps?.vote_average || 0; // 10点満点の平均評価
  const voteAverageToFiveStar = convertToFiveStar(voteAverage); // 5点満点に変換
  const voteCount = getVoteCount(MovieDetailProps); // 評価数を取得

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Box sx={{ textAlign: "center" }}>
        {/* 平均評価と評価数を表示 */}
        <Typography
          variant="body1"
          sx={{ color: "text.primary", fontSize: 50 }}
        >
          {voteAverage.toFixed(1)}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          ({voteCount} 件)
        </Typography>
      </Box>
      <Box sx={{ width: "50vw" }}>
        <Rating
          name="movie-rating"
          value={voteAverageToFiveStar}
          precision={0.1} // 0.1単位で星を表示
          readOnly // 読み取り専用
          emptyIcon={<StarIcon style={{ opacity: 1 }} />}
        />
      </Box>
    </Stack>
    // return <div>RatingStar: {convertToFiveStar({ MovieDetailProps })}</div>;
  );
}

export default RatingStar;
