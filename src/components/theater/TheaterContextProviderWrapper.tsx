"use client";

import { AllTheatersContext } from "@/contexts/AllTheatersContext";
import { TheaterSearchResponse } from "@/types/theater";

export default function TheaterContextProviderWrapper({
  children,
  value,
}: {
  children: React.ReactNode;
  value: TheaterSearchResponse[];
}) {
  return (
    <>
      <AllTheatersContext.Provider value={value}>
        {children}
      </AllTheatersContext.Provider>
    </>
  );
}
