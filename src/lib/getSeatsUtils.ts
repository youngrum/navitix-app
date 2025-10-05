import searchTheaterLocalApi from "@/services/searchTheaterLocalApi";

// シートのデータ取得
export async function getSeatData(auditoriumId: string) {
  const auditorium_id = Number(auditoriumId);
  try {
    const res = await searchTheaterLocalApi.get(`/getSeats/${auditorium_id}/`);
    return res.data;
  } catch (error) {
    console.error("Failed to fetch seat data", error);
    return null;
  }
}
