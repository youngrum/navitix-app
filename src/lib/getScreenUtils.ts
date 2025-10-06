import searchTheaterLocalApi from "@/services/searchTheaterLocalApi";
import { apiResponse } from "@/types/apiResponse";
import { ScreenResponse } from "@/types/screen";

export async function getScreenData(
  theater_id: string
): Promise<ScreenResponse | null> {
  try {
    const res: apiResponse<ScreenResponse> = await searchTheaterLocalApi.get(
      `/screen-schedules/${theater_id}/`
    );
    // console.log("%o", res.data);
    return res.data;
  } catch (error) {
    console.log("Failed to fetch", error);
    return null;
  }
}
