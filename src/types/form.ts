import { z } from "zod";

// Zodでバリデーションスキーマを定義
// ------- 会員登録フォームバリデーション定義
export const signUpSchema = z.object({
  email: z
    .string()
    .nonempty("メールアドレスは必須です")
    .email("正しいメールアドレスを入力してください"),
  password: z
    .string()
    .nonempty("パスワードは必須です")
    .min(8, "8文字以上、英数字と記号を含めてください")
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      "8文字以上、英数字と記号を含めてください"
    ),
});

// zodスキーマ定義による型推論
export type SignUpFormValues = z.infer<typeof signUpSchema>;

// 今日の日付を時刻情報をリセットして、日付のみ取得
const today = new Date();
today.setHours(0, 0, 0, 0);

// ------- プロフィール入力フォームバリデーション定義
export const profileSchema = z.object({
  accountName: z.string().nonempty("アカウント名は必須です"),
  email: z
    .string()
    .nonempty("メールアドレスは必須です")
    .email("正しいメールアドレスを入力してください"),
  birthDay: z
    .string()
    .refine(
      (dateString) => {
        const date = new Date(dateString);
        return date <= today;
      },
      { message: "今日以降の日付は選択できません。" }
    )
    .optional()
    .nullable(),
});

// プロフィール入力フォームの型
export type ProfileFormValues = z.infer<typeof profileSchema>;
