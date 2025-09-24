import searchTheaterLocalApi from "@/services/searchTheaterLocalApi";
import { apiResponse } from "@/types/apiResponse";
import { ScreenResponse } from "@/types/screen";

async function getScreenData(theater_id: string): Promise<ScreenResponse[]> {
  try {
    const res: apiResponse<ScreenResponse[]> = await searchTheaterLocalApi.get(
      `/screen-schedules/${theater_id}/`
    );
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.log("Failed to fetch", error);
    return [];
  }
}

export default async function page({
  params,
}: { params: Promise<{ theater_id: string }> }) {
  const { theater_id } = await params;

  const screenData = getScreenData(theater_id);

  return <div>{theater_id}</div>;
}
