import BackButton from "@/components/common/BackButton";
import Header1 from "@/components/common/header1";
import ThemeProviderWrapper from "@/components/ThemeProviderWrapper";
import { Stack } from "@mui/material";
import React from "react";
import SearchTheater from "../../components/theater/SearchTheater";

function Page() {
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
          <Header1 headerText="Theater" />
        </Stack>
        <SearchTheater />
      </ThemeProviderWrapper>
    </main>
  );
}

export default Page;
