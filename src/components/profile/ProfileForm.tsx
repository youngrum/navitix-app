"use client";

import InputEmailArea from "@/components/common/InputEmailArea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SubmitButton from "@/components/common/SubmitButton";
import NoticeModal from "@/components/common/NoticeModal";
import SignInLeads from "@/components/common/SignInLeads";
import Divider from "@mui/material/Divider";
import { profileSchema, ProfileFormValues } from "@/types/form";
import InputNameArea from "@/components/common/InputNameArea";
import InputBirthdayArea from "@/components/common/InputBirthdayArea";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CircularProgress } from "@mui/material";

export interface ProfileFormProps {
  userId: string;
  userEmail: string;
  initialData: {
    name?: string;
    birth_day?: string;
  } | null;
  submitText: string;
}

export default function ProfileForm({
  userId,
  userEmail,
  initialData,
  submitText,
}: ProfileFormProps) {
  const leadText = "パスワードを更新する方は";
  const toLogIn = "/reset-password";
  const readonly = false;
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessageHeader, setModalMessageHeader] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const router = useRouter();

  // React Hook Formがzodスキーマ定義でバリデーションできるように宣言
  const {
    register, // TSX内でinputに渡す
    handleSubmit, // サブミットイベントのラッパー関数
    control,
    formState: { errors },
    // setError, // バックエンドからのエラーメッセージを格納
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    mode: "onBlur", //フォーカスが外れた時をトリガーとする
    defaultValues: {
      email: userEmail,
      accountName: initialData?.name || "",
      birthDay: initialData?.birth_day || "",
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    console.log(data); // 検証済みのデータ

    try {
      const supabase = createClient();
      // 更新: UPDATE
      const { error } = await supabase
        .from("profiles")
        .update({
          name: data.accountName,
          birth_day: data.birthDay,
        })
        .eq("id", userId);

      if (error) {
        console.error("プロフィール更新エラー:", error);
        setModalMessageHeader("Update failed...");
        setModalMessage(
          "プロフィールの更新に失敗しました。もう一度お試しください。"
        );
      } else {
        setModalMessageHeader("Update successful!");
        setModalMessage("プロフィールを更新しました。");
        // 成功後、リフレッシュまたはリダイレクト
        setTimeout(() => {
          router.refresh();
        }, 2000);
      }
    } catch (err) {
      console.error("予期せぬエラー:", err);
      setModalMessageHeader("Error occurred...");
      setModalMessage(
        "システムエラーが発生しました。時間をおいて再度お試しください。"
      );
    } finally {
      setIsLoading(false);
      setModalOpen(true);
    }
  };

  return (
    <>
      {/** handleSubmitは第1引数に渡されたonSubmit関数を呼び出す */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputNameArea<ProfileFormValues>
          registerProps={register}
          errorProps={errors.accountName}
          readonlyProps={readonly}
        ></InputNameArea>
        <InputEmailArea<ProfileFormValues>
          registerProps={register}
          errorProps={errors.email}
          readonlyProps={true}
        ></InputEmailArea>
        <InputBirthdayArea<ProfileFormValues>
          control={control}
          errorProps={errors.birthDay}
          readonlyProps={readonly}
        ></InputBirthdayArea>

        <SignInLeads leadTextProps={leadText} toProps={toLogIn} />
        <Divider />
        <SubmitButton isLoading={isLoading} buttonText={submitText} />
        <NoticeModal
          openProps={modalOpen}
          messageProps={modalMessage}
          messageHeaderProps={modalMessageHeader}
        />
      </form>
      {isLoading && <CircularProgress color="secondary" />}
    </>
  );
}
