import BackButton from "@/components/common/BackButton";
import Header1 from "@/components/common/header1";
import ThemeProviderWrapper from "@/components/ThemeProviderWrapper";
import { Stack } from "@mui/material";
import React from "react";
import SearchTheater from "../../components/theater/SearchTextField";

function Page() {
  const header1Text = "Theater";
  const placeHolderText = "映画館・市区町村を入力";

  return (
    <main>
      <ThemeProviderWrapper>
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          sx={{ marginBottom: "35px" }}
        >
          <BackButton returnPath="/movies" />
          <Header1 headerText={header1Text} />
        </Stack>
        <SearchTheater placeHolderTextProps={placeHolderText} />
      </ThemeProviderWrapper>
    </main>
  );
}

export default Page;
