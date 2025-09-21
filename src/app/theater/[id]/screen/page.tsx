import searchTheaterLocalApi from "@/services/searchTheaterLocalApi";
import { apiResponse } from "@/types/apiResponse";
import { Typography } from "@mui/material";

async function getScreenData(theater_id: string): Promise<any[]> {
  try {
    const res: apiResponse<any[]> = await searchTheaterLocalApi.get(
      "/screen-schedules",
      { params: { id: theater_id } }
    );
    // console.log(res.data);
    return res.data;
  } catch (error) {
    console.log("Failed to fetch", error);
    return [];
  }
}

export default async function page({ params }: { params: { id: string } }) {
  const { id } = await params;

  const screenData = getScreenData(id);

  return <Typography>{id}</Typography>;
}
