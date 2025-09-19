import BackButton from "@/components/common/BackButton";
import Header1 from "@/components/common/Header1";
import ThemeProviderWrapper from "@/components/ThemeProviderWrapper";
import { Stack, Button } from "@mui/material";
import React from "react";
import searchTheaterLocalApi from "@/services/searchTheaterLocalApi";
import { TheaterSearchResponse } from "@/types/theater";
import { apiResponse } from "@/types/apiResponse";
import SearchTheaterContainer from "@/components/theater/SearchTheaterContainer";
import TheaterContextProviderWrapper from "@/components/theater/TheaterContextProviderWrapper";

// 現在映画館データを取得
async function getAllTheaterData(): Promise<TheaterSearchResponse[]> {
  try {
    const res: apiResponse<TheaterSearchResponse[]> =
      await searchTheaterLocalApi.get("/all-theaters");
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.log("Failed to fetch", error);
    return [];
  }
}

export async function Page() {
  const header1Text = "Theater";
  const allTheatersData = await getAllTheaterData();

  return (
    <main>
      <TheaterContextProviderWrapper value={allTheatersData}>
        <ThemeProviderWrapper>
          <Stack direction="row" alignItems="center" spacing={2}>
            <BackButton returnPath="/movies" />
            <Header1 headerText={header1Text} />
          </Stack>
          <SearchTheaterContainer />
        </ThemeProviderWrapper>
      </TheaterContextProviderWrapper>
    </main>
  );
}

export default Page;
