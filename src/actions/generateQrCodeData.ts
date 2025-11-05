"use server";

interface GenerateQrCodeDataProps {
  reservationId: number;
}

interface GenerateQrCodeDataResult {
  success: boolean;
  data?: string; // QRコードに含めるデータ（文字列）
  error?: string;
}

export async function generateQrCodeData({
  reservationId,
}: GenerateQrCodeDataProps): Promise<GenerateQrCodeDataResult> {
  try {
    const qrCodeValue = `ReservationID:${reservationId}-Token:${Date.now()}`;

    console.log(`qrCodeValue>>>>>${qrCodeValue}`);

    return {
      success: true,
      data: qrCodeValue,
    };
  } catch (err) {
    console.error(" QRコードデータ生成エラー:", err);
    return {
      success: false,
      error: "QRコードデータの生成中にエラーが発生しました。",
    };
  }
}
