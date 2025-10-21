"use client";
import React, { useState } from "react";
import SubmitButton from "./SubmitButton";
import SubmitButtonOL from "./SubmitButtonOL";
import { cancelReservation } from "@/actions/reservation/cancelReservation";
import { useRouter } from "next/navigation";

interface reservationProps {
  reservationId: number;
}

export function FormButtonWrapper({ reservationId }: reservationProps) {
  const submitTextQR = "QRコード表示";
  const submitTextCanccel = "予約をキャンセルする";
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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

  return (
    <>
      {error && (
        <div style={{ color: "red", padding: "16px", marginBottom: "16px" }}>
          エラー: {error}
        </div>
      )}

      <form action="">
        <SubmitButton
          isLoading={false}
          buttonText={submitTextQR}
        ></SubmitButton>
      </form>

      <form action={handleCancelReservation}>
        <SubmitButtonOL isLoading={isLoading} buttonText={submitTextCanccel} />
      </form>
    </>
  );
}
