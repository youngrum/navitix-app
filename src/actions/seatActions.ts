// actions/seatActions.ts
"use server";
import { SeatWithTheaterAndMovieResponse } from "@/types/seat";
import { getSeatData } from "@/lib/getSeatsUtils";

/**
 * クライアント側 (ReservationForm.tsx) の SWR fetcher から呼び出されるための
 * Server Action ラッパー関数。
 * @param auditoriumId - 上映室ID (stringとして受け取る)
 * @returns 座席データ、または null (エラー時)
 */
export async function getSeatDataForClient(
  auditoriumId: string,
  schedulesId: string
): Promise<SeatWithTheaterAndMovieResponse | null> {
  return await getSeatData(auditoriumId, schedulesId);
}
