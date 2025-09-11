"use client";

import BackButton from "@/components/common/BackButton";
import Header1 from "@/components/common/header1";
import SubText from "@/components/common/SubText";
import ThemeProviderWrapper from "@/components/ThemeProviderWrapper";
import { Box, Container, Stack, Divider } from "@mui/material";
import InputEmailArea from "@/components/common/InputEmailArea";
import InputPasswordArea from "@/components/common/InputPasswordArea";
import SignInLeads from "@/components/common/SignInLeads";
import SubmitButton from "../../components/common/SubmitButton";
import { FieldError, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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

export default function page() {
  const header1Text = "Create Account";
  const subText = "アカウントを作成してください";
  const leadText = "アカウントをお持ちの方は";
  const toLogIn = "/login";
  const submitText = "アカウント作成";
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
    <main>
      <ThemeProviderWrapper>
        <Container>
          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
            sx={{ marginBottom: "35px" }}
          >
            <BackButton returnPath="/" />
            <Header1 headerText={header1Text} />
          </Stack>
          <SubText subText={subText} />
          <form onSubmit={handleSubmit(onSubmit)}>
              <InputEmailArea
                registerProps={register}
                errorProps={errors.email as FieldError}
              />
              <InputPasswordArea
                registerProps={register}
                errorProps={errors.password as FieldError}
              />
            <Box>
              <SignInLeads leadTextProps={leadText} toProps={toLogIn} />
            </Box>
            <Divider />
            <SubmitButton isLoading={false} buttonText={submitText} />
          </form>
        </Container>
      </ThemeProviderWrapper>
    </main>
  );
}
