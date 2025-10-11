"use client";

import InputEmailArea from "@/components/common/InputEmailArea";
import InputPasswordArea from "@/components/common/InputPasswordArea";
import { FieldError, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/utils/supabase/client";
import SubmitButton from "@/components/common/SubmitButton";
import NoticeModal from "@/components/common/NoticeModal";
import SignInLeads from "@/components/common/SignInLeads";
import Divider from "@mui/material/Divider";
import { SigninFormValues, signinSchema } from "@/types/form";
import { useState } from "react";

type modalStatus =
  | "mail-success"
  | "mail-error"
  | "locked"
  | "notice"
  | "progress";

export default function SigninForm() {
  const submitText = "サインイン";
  const leadText = "パスワードを忘れた方は";
  const toLogIn = "/reset-password";
  const readOnly = false;
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessageHeader, setModalMessageHeader] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalIconStaus, setModalIconStatus] =
    useState<modalStatus>("mail-success");
  // React Hook Formがzodスキーマ定義でバリデーションできるように宣言
  const {
    register, // TSX内でinputに渡す
    handleSubmit, // サブミットイベントのラッパー関数
    formState: { errors },
    setError, // バックエンドからのエラーメッセージを格納
  } = useForm<SigninFormValues>({
    resolver: zodResolver(signinSchema),
    mode: "onBlur", //フォーカスが外れた時をトリガーとする
  });

  const onSubmit = async (data: SigninFormValues) => {
    console.log(data); // 検証済みのデータ
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        setModalMessageHeader("Signin failed...");
        // Supabaseからの特定のエラーを処理
        console.error("Supabaserログインエラー:", error.message);
        // if(error.message === "Invalid login credentials")
        setModalMessage(
          "ログインに失敗しました。正しいアドレスとパスワードを入力してください"
        );
        setModalIconStatus("mail-error");
        setModalOpen(true);
      } else {
        // サインアップ成功
        setModalMessageHeader("Redirecting...");
        setModalMessage("このままお待ちください");
        setModalIconStatus("progress");
        setModalOpen(true);
      }
    } catch (err) {
      // ネットワークエラーなど、予期せぬ実行時エラーを捕捉
      console.error("予期せぬエラー:", err);
      setModalMessageHeader("Sending failed...");
      setModalMessage(
        "システムエラーが発生しました。時間をおいて再度お試しください。"
      );
      setModalIconStatus("notice");
      setModalOpen(true);
    } finally {
      setIsLoading(false); // 処理が完了したらローディングを解除
      setModalOpen(true);
    }
  };

  return (
    <>
      {/** handleSubmitは第1引数に渡されたonSubmit関数を呼び出す */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputEmailArea<SigninFormValues>
          registerProps={register}
          errorProps={errors.email as FieldError}
          readonlyProps={readOnly}
        />
        <InputPasswordArea<SigninFormValues>
          registerProps={register}
          errorProps={errors.password as FieldError}
          readonlyProps={readOnly}
        />
        <SignInLeads leadTextProps={leadText} toProps={toLogIn} />
        <Divider />
        <SubmitButton isLoading={false} buttonText={submitText} />
        <NoticeModal
          openProps={modalOpen}
          messageProps={modalMessage}
          messageHeaderProps={modalMessageHeader}
          stausProps={modalIconStaus}
        />
      </form>
    </>
  );
}
