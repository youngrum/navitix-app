"use client";
// src/app/test/testprofileform/page.tsx
import ThemeProviderWrapper from "@/components/ThemeProviderWrapper";
import { ProfileFormValues, profileSchema } from "@/types/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextFieldEmailArea from "@/components/common/TextFieldEmailArea";
import TextFieldNameArea from "@/components/common/TextFieldNameArea";
import TextFieldBirthdayArea from "@/components/common/TextFieldBirthdayArea";
import SubmitButton from "@/components/common/SubmitButton";

export default function TestPage() {
  const readonly = false;
    const {
      register, // TSX内でinputに渡す
      handleSubmit, // サブミットイベントのラッパー関数
      control,
      formState: { errors },
      setError, // バックエンドからのエラーメッセージを格納
    } = useForm<ProfileFormValues>({
      resolver: zodResolver(profileSchema),
      mode: "onBlur", //フォーカスが外れた時をトリガーとする
    });
  
  const onSubmit = (data: ProfileFormValues) => {
    console.log(data); // 検証済みのデータ
  };

  return (

      <ThemeProviderWrapper>
        <form onSubmit={handleSubmit(onSubmit)}>
        <TextFieldNameArea
            registerProps={register}
            errorProps={errors.accountName}
            readonlyProps={readonly}/>
        <TextFieldEmailArea
            registerProps={register}
            errorProps={errors.email}
            readonlyProps={readonly}/>
        <TextFieldBirthdayArea
            control={control}
            errorProps={errors.birthDay}
            readonlyProps={readonly}/>
        <SubmitButton isLoading={false} buttonText={"テスト"} />
        </form>
      </ThemeProviderWrapper>
      
    // </Box>
  );
}
