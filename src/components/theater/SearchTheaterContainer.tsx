"use client";

import { TheaterSearchResponse } from "@/types/thater";
import { useState } from "react";
import SearchTheaterAutocomplete from "@/components/theater/SearchTheaterAutocomplete";
import SuggestTheaterList from "@/components/theater/SuggestTheaterList";

interface allTheatersProps {
    allTheatersProps: TheaterSearchResponse[];
}

export default function SearchTheaterContainer({ allTheatersProps }: allTheatersProps) {
  const [suggestions, setSuggestions] = useState<TheaterSearchResponse[]>([]);

  return (
    <>
      <SearchTheaterAutocomplete allTheatersProps={allTheatersProps} setData={setSuggestions}/>
      <SuggestTheaterList theaterlist={suggestions}/>
    </>
  );
  

}