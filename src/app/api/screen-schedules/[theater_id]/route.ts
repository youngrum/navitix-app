import { schedules } from "@/lib/screenDB"; // 上映時間はソースコードで管理
import { createPublicSupabaseClient } from "@/utils/supabase/public";
import {
  getMovieDetailData,
  getMovieReleaseData,
  formatMovieDetail,
} from "@/lib/movieDetailUtils";
import { NextRequest, NextResponse } from "next/server";
import { ScreenResponse, ScreenSchedule } from "@/types/screen";

export async function GET(
  req: NextRequest, // 第一引数にrequestオブジェクトおかないとparamsが取れない
  { params }: { params: Promise<{ theater_id: string }> }
) {
  // Next.js 15+ では params が Promise の場合がある
  const { theater_id } = await params;

  if (!params || !theater_id) {
    return NextResponse.json(
      { error: "theater_id パラメータが見つかりませんでした" },
      { status: 404 }
    );
  }

  // パスパラメーターを数値に変換
  const theaterId = Number(theater_id);

  // supabaseクライアント宣言
  const supabase = createPublicSupabaseClient();

  // パスパラメーターのtheaterIdから映画館レコードを取得
  const { data: theaterData, error: theaterError } = await supabase
    .from("theaters")
    .select("id, name, address")
    .eq("id", theaterId)
    .maybeSingle(); // 1件のみ取得

  if (theaterError) {
    console.error("Supabase theater data fetch error:", theaterError);
    return NextResponse.json(
      { error: "映画館データの取得に失敗しました" },
      { status: 500 }
    );
  }

  if (!theaterData) {
    return NextResponse.json(
      { error: "映画館は見つかりませんでした" },
      { status: 404 }
    );
  }

  // 映画館の上映室取得
  const { data: auditoriumData, error: auditoriumError } = await supabase
    .from("auditoriums") // テーブル名を仮に 'auditoriums' とします
    .select("*") // 全てのカラムを取得（または必要なカラムを選択）
    .eq("theater_id", theaterId);

  if (auditoriumError) {
    console.error("Supabase auditorium data fetch error:", auditoriumError);
    return NextResponse.json(
      { error: "上映室データの取得に失敗しました" },
      { status: 500 }
    );
  }

  if (!auditoriumData || auditoriumData.length === 0) {
    return NextResponse.json(
      { error: "上映室が見つかりませんでした" },
      { status: 404 }
    );
  }

  // 各上映室オブジェクトに対して上映作品、スケジュールを追加
  const auditoriumsWithMoviesAndSchedules = await Promise.all(
    auditoriumData.map(async (auditorium) => {
      // 各上映室のスケジュールを取得
      const schedulesForAuditorium = schedules.filter(
        (schedule) => schedule.auditorium_id === auditorium.id
      );

      if (!schedulesForAuditorium) {
        return {
          ...auditorium,
          movie: null,
          schedules: [],
          error: "スケジュールが見つかりませんでした",
        };
      }

      // 各上映室の上映作品を取得 上映室と作品は１対１なので最初の配列から１つ取得
      const movieDetail = await getMovieDetailData(
        schedulesForAuditorium[0].movie_id
      );

      if (!movieDetail) {
        return {
          ...auditorium,
          movie: null,
          schedules: [],
          error: "上映作品が見つかりませんでした",
        };
      }

      // 映画作品のリリース情報を取得
      const release = await getMovieReleaseData(
        schedulesForAuditorium[0].movie_id
      );

      // 映画詳細を簡略化
      const simplifiedMovieDetail = formatMovieDetail(movieDetail, release);

      // スケジュール情報を簡略化
      const groupedSchedules = schedulesForAuditorium.reduce(
        (acc, schedule) => {
          const startDate = new Date(schedule.start_time);

          const date = startDate.toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          });
          const week = startDate.toLocaleDateString("ja-JP", {
            weekday: "short",
          });
          const play_beginning = startDate.toLocaleTimeString("ja-JP", {
            hour: "2-digit",
            minute: "2-digit",
          });

          // date: 'YYYY/MM/DD'（例: '2025/09/26'）を '/' で分割
          const dateParts = date.split("/");
          // 配列の3番目の要素（インデックス2）が 'DD' の部分
          const day = dateParts[2]; // 例: '26'

          // 既存の日付グループを探す
          const existingGroup = acc.find((g) => g.date === date);

          const showtime = {
            id: schedule.id,
            play_beginning,
            start_time: schedule.start_time,
            end_time: schedule.end_time,
          };

          if (existingGroup) {
            existingGroup.day = day;
            existingGroup.showtimes.push(showtime);
          } else {
            acc.push({
              date,
              week,
              day,
              showtimes: [showtime],
            });
          }

          return acc;
        },
        [] as ScreenSchedule[]
      );

      return {
        ...auditorium,
        movie: simplifiedMovieDetail,
        schedules: groupedSchedules,
      };
    })
  );

  // console.log(
  //   "auditoriumsWithMoviesAndSchedules>>>>>>",
  //   auditoriumsWithMoviesAndSchedules
  // );

  const responseData = {
    theater_id: theaterData.id, // 映画館ID
    theater_name: theaterData.name, // 映画館名
    location: theaterData.address, // 映画館の場所
    auditoriums: auditoriumsWithMoviesAndSchedules, // 上映室とスケジュールデータ
  } as ScreenResponse | null;

  // console.log("responseData>>>>>>", responseData);

  return NextResponse.json(responseData, {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
