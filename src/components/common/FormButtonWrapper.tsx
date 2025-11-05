"use client";
import React, { useEffect, useRef, useState } from "react";
import SubmitButton from "./SubmitButton";
import SubmitButtonOL from "./SubmitButtonOL";
import { cancelReservation } from "@/actions/reservation/cancelReservation";
import { useRouter } from "next/navigation";
import QrCodeDisplay from "@/components/tickets/QrCodeDisplay";
import { Box } from "@mui/material";
import { generateQrCodeData } from "@/actions/generateQrCodeData";
import { ReservationsTable } from "@/types/reservation";

interface reservationProps {
  ticketData: ReservationsTable;
}

export function FormButtonWrapper({ ticketData }: reservationProps) {
  const submitTextQR = "QRコード表示";
  const submitTextCanccel = "予約をキャンセルする";
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [isQrCodeVisible, setIsQrCodeVisible] = useState(false);
  const [qrCodeValue, setQrCodeValue] = useState("");
  const containerRef = useRef<HTMLDivElement>(
    null
  ) as React.RefObject<HTMLDivElement>;
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    if (ticketData.payment_status === "PAID") {
      setIsDisabled(true);
    }
  }, [ticketData.payment_status]);

  const handleCancelReservation = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log(`キャンセル開始: reservation ${reservationId}`);
      const result = await cancelReservation({ reservationId });

      if (result.success) {
        console.log("✓ キャンセル成功");
        // ルーター遷移
        router.push("/movies");
      } else {
        console.error("✗ キャンセル失敗:", result.error);
        setError(result.error || "キャンセルに失敗しました");
      }
    } catch (err) {
      console.error("エラー:", err);
      setError("予期しないエラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowQR = async () => {
    if (isQrCodeVisible) {
      // 既に表示されている場合は非表示にする
      setIsQrCodeVisible(false);
      setQrCodeValue("");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log(`QRコードデータ生成開始: reservation ${ticketData.id}`);
      // Server Actionの呼び出し
      const result = await generateQrCodeData({ reservationId: ticketData.id });

      if (result.success && result.data) {
        console.log("✓ QRコードデータ生成成功");
        setQrCodeValue(result.data); // QRコードに渡すデータを設定
        setIsQrCodeVisible(true); // スライド表示をトリガー
      } else {
        console.error("QRコードデータ生成失敗:", result.error);
        setError(result.error || "QRコードの表示に失敗しました");
      }
    } catch (err) {
      console.error("エラー:", err);
      setError("予期しないエラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box ref={containerRef} sx={{ position: "relative", minHeight: "200px" }}>
      {error && (
        <Box style={{ color: "red", padding: "16px", marginBottom: "16px" }}>
          エラー: {error}
        </Box>
      )}

      {isDisabled && (
        <SubmitButton
          isLoading={isLoading}
          buttonText={submitTextQR}
          onClick={handleShowQR}
        ></SubmitButton>
      )}

      <form action={handleCancelReservation}>
        <SubmitButtonOL isLoading={isLoading} buttonText={submitTextCanccel} />
      </form>

      {isQrCodeVisible && (
        <QrCodeDisplay
          qrCodeValue={qrCodeValue}
          onClose={() => setIsQrCodeVisible(false)}
          ticketData={ticketData}
          containerRef={containerRef}
        />
      )}
    </Box>
  );
}
