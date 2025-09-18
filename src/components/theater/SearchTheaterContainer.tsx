"use client";

import { TheaterSearchResponse } from "@/types/theater";
import { useState } from "react";
import SearchTheaterAutocomplete from "@/components/theater/SearchTheaterAutocomplete";
import SuggestTheaterList from "@/components/theater/SuggestTheaterList";
import { Divider } from "@mui/material";

interface allTheatersProps {
  allTheatersProps: TheaterSearchResponse[];
}

export default function SearchTheaterContainer() {
  const [suggestions, setSuggestions] = useState<TheaterSearchResponse[]>([]);
  const [isSearched, setIsSearched] = useState(false); // 検索が実行されたかの状態

  return (
    <>
      <SearchTheaterAutocomplete
        setData={setSuggestions}
        setBoolean={setIsSearched}
      />
      <Divider sx={{ my: 2 }} />
      <SuggestTheaterList
        theaterlist={suggestions}
        isSearchedProps={isSearched}
      />
    </>
  );
}
