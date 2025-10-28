"use client";

import InputEmailArea from "@/components/common/InputEmailArea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SignInLeads from "@/components/common/SignInLeads";
import Divider from "@mui/material/Divider";
import { ProfileFormValues, profileDisplaySchema } from "@/types/form";
import InputNameArea from "@/components/common/InputNameArea";
import InputBirthdayArea from "@/components/common/InputBirthdayArea";
import LinkButton from "@/components/common/LinkButton";
import SubmitButtonOL from "@/components/common/SubmitButtonOL";
import { logout } from "@/actions/logoutActions";

export interface ProfileDisplayProps {
  userEmail: string;
  initialData: {
    name?: string;
    birth_day?: string;
  } | null;
}

export default function ProfileDisplay({
  userEmail,
  initialData,
}: ProfileDisplayProps) {
  const toEditLink = "profile/edit";
  const linkText = "プロフィールを修正";
  const leadText = "パスワードを更新する方は";
  const submitText = "ログアウト";
  const toLogIn = "/reset-password";
  const readonly = true;

  // React Hook Formがzodスキーマ定義でバリデーションできるように宣言
  const {
    register, // TSX内でinputに渡す
    //handleSubmit, // サブミットイベントのラッパー関数
    control,
    formState: { errors },
    // setError, // バックエンドからのエラーメッセージを格納
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileDisplaySchema),
    mode: "onBlur",
    defaultValues: {
      email: userEmail,
      accountName: initialData?.name || "",
      birthDay: initialData?.birth_day || "",
    },
  });

  return (
    <>
      {/** handleSubmitは第1引数に渡されたonSubmit関数を呼び出す */}
      <InputNameArea<ProfileFormValues>
        registerProps={register}
        errorProps={errors.accountName}
        readonlyProps={readonly}
      ></InputNameArea>
      <InputEmailArea<ProfileFormValues>
        registerProps={register}
        errorProps={errors.email}
        readonlyProps={readonly}
      ></InputEmailArea>
      <InputBirthdayArea<ProfileFormValues>
        control={control}
        errorProps={errors.birthDay}
        readonlyProps={readonly}
      ></InputBirthdayArea>
      <SignInLeads leadTextProps={leadText} toProps={toLogIn} />
      <Divider />
      <LinkButton toProps={toEditLink} buttonTextProps={linkText} />
      <form action={logout}>
        <SubmitButtonOL isLoading={false} buttonText={submitText} />
      </form>
    </>
  );
}
