"use client";

import {
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
  Box,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import { styled } from "@mui/material/styles";
import {
  UseFormRegister,
  FieldError,
  FieldValues,
  Path,
} from "react-hook-form";
import { SignUpFormValues } from "@/types/form";
import theme from "@/styles/theme";

// Tは必ずフォーム入力項目(FieldValues) と string型のemailというプロパティを持つ
interface FormProps<T extends { email: string } & FieldValues> {
  registerProps: UseFormRegister<T>;
  errorProps?: FieldError;
  readonlyProps?: boolean;
}

// Inputのデザイン定義
const CustomInput = styled(Input)({
  // 背景色とボーダーをカスタマイズ
  backgroundColor: "#f5f5f5",
  borderRadius: "4px",
  padding: "8px 12px",
  border: "0.8px solid #DADADA",
  // フォーカス時のスタイル
  "&.Mui-focused": {
    border: `1px solid ${theme.palette.text.secondary}`,
    // boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)', // フォーカス時の影
    "& .MuiSvgIcon-root": {
      color: "text.primary",
    },
  },
});

// コンポーネントのジェネリック型Tにも同じ制約を適用
export default function InputEmailArea<
  T extends { email: string } & FieldValues
>({ registerProps, errorProps, readonlyProps }: FormProps<T>) {
  return (
    <Box sx={{ maxWidth: "600px", mt: "50px" }}>
      <FormControl variant="outlined" sx={{ width: "100%" }}>
        <InputLabel
          htmlFor="email"
          required
          sx={{ fontSize: "20px", fontWeight: "bold", left: "-10px" }}
        >
          Email
        </InputLabel>
        <CustomInput
          id="email"
          disableUnderline={true}
          readOnly={readonlyProps}
          {...registerProps("email" as Path<T>)} // ここでregisterを適用。Path<T>はTに渡すzodスキーマ定義のプロパティ
          error={Boolean(errorProps)} // MUIのエラー表示
          startAdornment={
            <InputAdornment position="start">
              <EmailIcon color="primary" />
            </InputAdornment>
          }
          placeholder="example@gmail.com"
        />
        {errorProps && (
          <span style={{ color: "red", fontSize: "14px", paddingTop: "10px" }}>
            {errorProps.message}
          </span>
        )}
      </FormControl>
    </Box>
  );
}
