import {
  getMovieDetailData,
  getMovieReleaseData,
  formatMovieDetail,
} from "@/lib/movieDetailUtils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest, // 第一引数にrequestオブジェクトおかないとparamsが取れない
  { params }: { params: Promise<{ movie_id: string }> }
) {
    const { movie_id } = await params;
    
    // パスパラメーターを数値に変換
    const movieId = Number(movie_id);

    if (!params || !movie_id) {
      return NextResponse.json(
        { error: "映画情報が見つかりませんでした" },
        { status: 400 }
      );
    }
  
    // TMDBにリクエストを送信
    const detail = await getMovieDetailData(movieId);
        if ( !detail ) {
      return NextResponse.json(
        { error: "映画情報が見つかりませんでした" },
        { status: 400 }
      );
    }
    const release = await getMovieReleaseData(movieId);

    // オブジェクトの各プロパティを整形
    const simplifiedMovieDetail = formatMovieDetail( detail, release );

    return NextResponse.json(simplifiedMovieDetail, { status: 200 });
}