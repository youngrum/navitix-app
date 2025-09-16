"use client";
// src/app/test/testloginform/page.tsx
import ThemeProviderWrapper from "@/components/ThemeProviderWrapper";
import { SignUpFormValues, signUpSchema } from "@/types/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextFieldPasswordArea from "@/components/common/TextFieldPasswordArea";
import TextFieldEmailArea from "@/components/common/TextFieldEmailArea";


export default function TestPage() {
  const readonly = false;
    const {
      register, // TSX内でinputに渡す
      handleSubmit, // サブミットイベントのラッパー関数
      control,
      formState: { errors },
      setError, // バックエンドからのエラーメッセージを格納
    } = useForm<SignUpFormValues>({
      resolver: zodResolver(signUpSchema),
      mode: "onBlur", //フォーカスが外れた時をトリガーとする
    });
  
  return (

      <ThemeProviderWrapper>
        <TextFieldEmailArea
            registerProps={register}
            errorProps={errors.email}
            readonlyProps={readonly}/>
        <TextFieldPasswordArea
            registerProps={register}
            errorProps={errors.password}
            readonlyProps={readonly}/>
      </ThemeProviderWrapper>
    // </Box>
  );
}
