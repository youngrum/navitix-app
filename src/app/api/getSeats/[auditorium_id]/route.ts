import { seats } from "@/lib/seatTable";
import { theaters } from "@/lib/theaterTable";
import { SeatsData, SeatWithTheaterAndMovieResponse } from "@/types/seat";
import { schedules } from "@/lib/screenDB";
import { auditoriums } from "@/lib/screenDB";
import { NextRequest, NextResponse } from "next/server";
import { getMovieDetailData } from "@/lib/movieDetailUtils";
import { Theater } from "@/types/theater";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ auditorium_id: string }> }
) {
  const { auditorium_id } = await params;

  const auditoriumId = Number(auditorium_id);

  // パスパラメーターのauditorium_idから映画館レコードを取得
  const theaterData: Theater | undefined = theaters.find(
    (theater) => theater.id === auditoriumId
  );
  if (!theaterData) {
    return NextResponse.json({ error: "Theater not found" }, { status: 404 });
  }

  // auditorium_id からスクリーン名称を取得
  const auditoriumsData = auditoriums.find(
    (auditorium) => auditorium.id === auditoriumId
  );
  if (!auditoriumsData) {
    return NextResponse.json(
      { error: "Auditorium not found" },
      { status: 404 }
    );
  }
  const auditoriumName = auditoriumsData.name;

  //スケジュールデータを取得
  const scheduleData = schedules.find(
    (schedule) => schedule.auditorium_id === auditoriumId
  );

  if (!scheduleData) {
    return NextResponse.json(
      { error: "Schedule not found for this auditorium" },
      { status: 404 }
    );
  }
  const scheduleId = scheduleData.id;

  // スケジュールデータから movie_id を取得
  const movieId = scheduleData.movie_id;
  if (!movieId) {
    return NextResponse.json(
      { error: "Movie ID not found in schedule" },
      { status: 404 }
    );
  }

  // movie_id を使用して、座席データをフィルタリング
  const movieData = await getMovieDetailData(movieId);
  if (!movieData) {
    return NextResponse.json(
      { error: "Movie details not found" },
      { status: 404 }
    );
  }

  const movieTitle = movieData.title;

  const seatData: SeatsData[] = seats.filter(
    (seat) => seat.auditorium_id === auditoriumId
  );

  if (!seatData || seatData.length === 0) {
    return NextResponse.json(
      { error: "Auditorium not found" },
      { status: 404 }
    );
  }

  const responseData: SeatWithTheaterAndMovieResponse = {
    theaterData: theaterData,
    schedulesId: scheduleId,
    auditoriumName: auditoriumName,
    seatData: seatData,
    movieTitle: movieTitle,
  };

  return NextResponse.json(responseData);
}
