"use client";

import InputEmailArea from "@/components/common/InputEmailArea";
import InputPasswordArea from "@/components/common/InputPasswordArea";
import { FieldError, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import SubmitButton from "@/components/common/SubmitButton";
import NoticeModal from "@/components/common/NoticeModal";
import SignInLeads from "@/components/common/SignInLeads";
import Divider from "@mui/material/Divider";
import { SignUpFormValues, signUpSchema } from "@/types/form";

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
        <NoticeModal />
      </form>
    </>
  );
}
