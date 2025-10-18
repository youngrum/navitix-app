import { Resend } from "resend";

/**
 * 決済メール送信処理
 */
export async function sendPaymentEmail(
  email: string,
  checkoutUrl: string,
  uniqueCode: string,
  movieTitle: string,
  seatCount: number,
  theaterName: string,
  seatInfo: string
) {
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);

      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "【映画予約】決済手続のご案内",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">映画チケット予約受付完了</h2>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>予約番号:</strong> ${uniqueCode}</p>
              <p><strong>映画館：</strong> ${theaterName}</p>
              <p><strong>上映作品：</strong> ${movieTitle}</p>
              <p><strong>座席(${seatCount}):</strong> ${seatInfo}</p>
            </div>
            <p>以下のリンクから決済を完了してください。</p>
            <p style="color: #d9534f;"><strong>有効期限: 1時間</strong></p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${checkoutUrl}" 
                style="background: #007bff; color: white; padding: 12px 24px; 
                        text-decoration: none; border-radius: 4px; display: inline-block;">
                決済ページへ進む
              </a>
            </div>
            <p style="font-size: 12px; color: #666;">
              ※このメールは送信専用です。返信はできません。
            </p>
          </div>
        `,
      });

      // console.log("✓ メール送信成功:", email);
      // console.log("=== 決済メール送信 ===");
      // console.log("To:", email);
      // console.log("予約番号:", uniqueCode);
      // console.log("決済URL:", checkoutUrl);
      // console.log("==================");
    } catch (error) {
      console.error("メール送信エラー:", error);
      // メール送信失敗してもエラーにしない（決済URLは生成済み）
    }
  } else {
    // 開発環境用: コンソールに出力
    console.log("=== 決済メール送信（開発モード） ===");
    console.log("To:", email);
    console.log("予約番号:", uniqueCode);
    console.log("決済URL:", checkoutUrl);
    console.log("============================");
  }
}
