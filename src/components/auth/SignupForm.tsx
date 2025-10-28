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
import { SignUpFormValues, signUpSchema } from "@/types/form";
import { useState } from "react";
import { modalStatus } from "@/types/modalStatus";

export default function SignupForm() {
  const submitText = "アカウント作成";
  const leadText = "アカウントをお持ちの方は";
  const toLogIn = "/login";
  const readOnly = false;
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessageHeader, setModalMessageHeader] = useState("");
  const [modalIconStaus, setModalIconStatus] =
    useState<modalStatus>("mail-success");
  const [modalMessage, setModalMessage] = useState("");
  // React Hook Formがzodスキーマ定義でバリデーションできるように宣言
  const {
    register, // TSX内でinputに渡す
    handleSubmit, // サブミットイベントのラッパー関数
    formState: { errors },
    // setError, // バックエンドからのエラーメッセージを格納
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    mode: "onBlur", //フォーカスが外れた時をトリガーとする
  });

  const onSubmit = async (data: SignUpFormValues) => {
    setIsLoading(true);
    try {
      // Supabaseにサインアップリクエストを送信
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/profile/edit`,
        },
      });

      if (error) {
        setModalMessageHeader("Sending failed...");
        setModalIconStatus("notice");
        // Supabaseからの特定のエラーを処理
        console.error("Supabaseサインアップエラー:", error.message);
        const errorMessage = error.message.trim().toLowerCase();
        if (errorMessage === "user already registered") {
          setModalMessage(
            "このメールアドレスはすでに登録されています。ログイン画面からサインインしてください。"
          );
        } else {
          setModalMessage(
            "メール送信に失敗しました。送信されなかった場合は、再度登録をしてください"
          );
        }
        setModalOpen(true);
      } else {
        // サインアップ成功
        setModalMessageHeader("Mail was sent!");
        setModalIconStatus("mail-success");
        setModalMessage(
          "サインアップに成功しました。認証メールをご確認ください。"
        );
        setModalOpen(true);
      }
    } catch (err) {
      // ネットワークエラーなど、予期せぬ実行時エラーを捕捉
      console.error("予期せぬエラー:", err);
      setModalMessageHeader("Sending failed...");
      setModalIconStatus("notice");
      setModalMessage(
        "システムエラーが発生しました。時間をおいて再度お試しください。"
      );
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
        <InputEmailArea
          registerProps={register}
          errorProps={errors.email as FieldError}
          readonlyProps={readOnly}
        />
        <InputPasswordArea
          registerProps={register}
          errorProps={errors.password as FieldError}
          readonlyProps={readOnly}
        />
        <SignInLeads leadTextProps={leadText} toProps={toLogIn} />
        <Divider />
        <SubmitButton isLoading={isLoading} buttonText={submitText} />
        <NoticeModal
          openProps={modalOpen}
          messageProps={modalMessage}
          messageHeaderProps={modalMessageHeader}
          stausProps={modalIconStaus}
          onCloseProps={() => setModalOpen(false)}
        />
      </form>
    </>
  );
}
