import BackButton from "@/components/common/BackButton";
import Header1 from "@/components/common/Header1";
import ThemeProviderWrapper from "@/components/ThemeProviderWrapper";
import { Stack } from "@mui/material";
import React from "react";
import { TheaterSearchResponse } from "@/types/theater";
import SearchTheaterContainer from "@/components/theater/SearchTheaterContainer";
import TheaterContextProviderWrapper from "@/components/theater/TheaterContextProviderWrapper";
import { getTheaters } from "@/actions/theater/getTheaters";

// 現在映画館データを取得
async function getAllTheaterData(
  movieId?: string
): Promise<TheaterSearchResponse[]> {
  try {
    const res = await getTheaters(movieId ? { movie_id: movieId } : undefined);

    if (res.error) {
      console.log("Error fetching theaters:", res.error);
      return [];
    }

    return res.data || [];
  } catch (error) {
    console.log("Failed to fetch", error);
    return [];
  }
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const header1Text = "映画館";
  const { movie_id } = await searchParams;
  const allTheatersData = await getAllTheaterData(movie_id);
  // console.log("allTheatersData>>>>>>>>>", allTheatersData);

  return (
    <main>
      <TheaterContextProviderWrapper value={allTheatersData}>
        <ThemeProviderWrapper>
          <Stack direction="row" alignItems="center" spacing={2}>
            <BackButton returnPath="/" />
            <Header1 headerText={header1Text} />
          </Stack>
          <SearchTheaterContainer />
        </ThemeProviderWrapper>
      </TheaterContextProviderWrapper>
    </main>
  );
}
