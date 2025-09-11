import { z } from "zod";

// Zodでバリデーションスキーマを定義
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
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
      "8文字以上、英数字と記号を含めてください"
    ),
});

// zodスキーマ定義による型推論
export type SignUpFormValues = z.infer<typeof signUpSchema>;
