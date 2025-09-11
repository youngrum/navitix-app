"use client";

import InputEmailArea from "@/components/common/InputEmailArea";
import InputPasswordArea from "@/components/common/InputPasswordArea";
import { FieldError, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import SubmitButton from "@/components/common/SubmitButton";
import NoticeMordal from "@/components/common/NoticeMordal";
import SignInLeads from "@/components/common/SignInLeads";
import Divider from "@mui/material/Divider";

// Zodでバリデーションスキーマを定義
const signUpSchema = z.object({
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

export default function SignupForm() {
	const submitText = "アカウント作成";
	const leadText = "アカウントをお持ちの方は";
	const toLogIn = "/login";
  // React Hook Formがzodスキーマ定義でバリデーションできるように宣言
  const {
    register, // TSX内でinputに渡す
    handleSubmit, // サブミットイベントのラッパー関数
    formState: { errors },
    setError, // バックエンドからのエラーメッセージを格納
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    mode: "onBlur", //フォーカスが外れた時をトリガーとする
  });
  // zodスキーマ定義による型推論
  type SignUpFormValues = z.infer<typeof signUpSchema>;

  const onSubmit = (data: SignUpFormValues) => {
    console.log(data); // 検証済みのデータ
  };

  return (
    <>
			{/** handleSubmitは第1引数に渡されたonSubmit関数を呼び出す */}
			<form onSubmit={handleSubmit(onSubmit)}>
				<InputEmailArea
				registerProps={register}
				errorProps={errors.email as FieldError}
				/>
				<InputPasswordArea
				registerProps={register}
				errorProps={errors.password as FieldError}
				/>
				<SignInLeads leadTextProps={leadText} toProps={toLogIn} />
				<Divider />
				<SubmitButton isLoading={false} buttonText={submitText} />
				<NoticeMordal />
			</form>
    </>

  );
}
