import { TheaterSearchResponse } from "@/types/theater";
import { Box, Typography, Divider } from "@mui/material";
import FmdGoodOutlinedIcon from "@mui/icons-material/FmdGoodOutlined";
import theme from "@/styles/theme";
import Image from "next/image";
import LinkButton from '@/components/common/LinkButton';

interface theaterlistProps {
  theaterlist: TheaterSearchResponse[];
  isSearchedProps: boolean;
}

export default function SuggestTheaterList({
  theaterlist,
  isSearchedProps,
}: theaterlistProps) {
  return (
    <>
      {theaterlist && theaterlist.length > 0 ? (
        theaterlist.map(
          (theater) =>
            theater && (
              <Box key={theater.id}>
                <Typography variant="h2" sx={{ fontSize: 20 }}>
                  {theater.name}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: 14,
                    color: theme.palette.grey[500],
                    alienItems: "center",
                  }}
                >
                  <FmdGoodOutlinedIcon sx={{ height: 24, width: 24, pt: 1 }} />
                  {theater.prefecture}
                  {theater.city}
                </Typography>
                <Box
                  sx={{
                    borderRadius: 3,
                    overflow: "hidden",
                    boxShadow: 3,
                    aspectRatio: "1.8 / 1",
                    maxWidh: "100%",
                    mb: 1,
                    position: "relative",
                  }}
                >
                  <Image
                    src={theater.photoPath}
                    alt={`${theater.name}_photo`}
                    fill // 親要素のサイズに合わせて画像を拡大・縮小
                    style={{ objectFit: "cover" }} // 画像をトリミングして親要素にフィットさせる
                    priority={true}
                    sizes="30vw"
                  ></Image>
                </Box>
                <LinkButton buttonTextProps={"上映作品を確認する"} toProps={`/theater/${theater.id}/screen`} ></LinkButton>
                <Divider />
              </Box>
            )
        )
      ) : isSearchedProps ? (
        <Typography>映画館は見つかりませんでした</Typography>
      ) : (
        ""
      )}
    </>
  );
}
