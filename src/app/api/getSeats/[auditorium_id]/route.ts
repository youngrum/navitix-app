import { createServerSupabaseClient } from "@/utils/supabase/server";
import { SeatWithTheaterAndMovieResponse } from "@/types/seat";
import { schedules } from "@/lib/screenDB";
import { NextRequest, NextResponse } from "next/server";
import { getMovieDetailData } from "@/lib/movieDetailUtils";
import { Theater } from "@/types/theater";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ auditorium_id: string }> }
) {
  const { auditorium_id } = await params;

  const auditoriumId = Number(auditorium_id);

  // supabaseクライアント宣言
  const supabase = await createServerSupabaseClient();

  // ユーザーチェック
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // 認証されていない場合は 401 Unauthorized を返す
    return NextResponse.json(
      { error: "Authentication required to view seat data." },
      { status: 401 }
    );
  }

  // パスパラメーターのauditorium_idから上映室レコードを取得
  const { data: auditoriumsData, error: auditoriumError } = await supabase
    .from("auditoriums") // テーブル名: 'auditoriums'
    .select("id, theater_id, name") // 必要なカラムを選択
    .eq("id", auditoriumId)
    .maybeSingle(); // 1件のみ取得

  if (auditoriumError || !auditoriumsData) {
    console.error("Supabase auditorium data fetch error:", auditoriumError);
    return NextResponse.json(
      { error: "Auditorium not found" },
      { status: 404 }
    );
  }
  const auditoriumName = auditoriumsData.name;
  const theaterId = auditoriumsData.theater_id;

  // theatersテーブルから対象の上映室を持つ映画館レコードを取得
  const { data: theaterData, error: theaterError } = await supabase
    .from("theaters") // テーブル名: 'theaters'
    .select("id, name, address") // 必要なカラムを選択（Theater型に合わせる）
    .eq("id", theaterId)
    .maybeSingle<Theater>();

  if (theaterError || !theaterData) {
    console.error("Supabase theater data fetch error:", theaterError);
    return NextResponse.json({ error: "Theater not found" }, { status: 404 });
  }
  //スケジュールデータを取得 schedulesテーブルは配列で疑似的なテーブルを構成
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

  // seatsテーブルから対象の上映室を持つレコードを取得
  const { data: seatData, error: seatError } = await supabase
    .from("seats") // テーブル名: 'seats'
    .select("*") // 全ての座席データを取得
    .eq("auditorium_id", auditoriumId);

  if (seatError || !seatData || seatData.length === 0) {
    console.error("Supabase seat data fetch error:", seatError);
    return NextResponse.json({ error: "Seat data not found" }, { status: 404 });
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
