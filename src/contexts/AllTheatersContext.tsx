import { createContext } from "react";
import { TheaterSearchResponse } from "@/types/theater";

// Contextをエクスポートする
export const AllTheatersContext = createContext<TheaterSearchResponse[]>([]);
