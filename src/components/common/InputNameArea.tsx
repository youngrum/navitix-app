"use client";

import {
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  UseFormRegister,
  FieldError,
  FieldValues,
  Path,
} from "react-hook-form";
import { ProfileFormValues } from "@/types/form";
import theme from "@/styles/theme";
import { useState } from "react";

interface FormProps<T extends { accountName: string } & FieldValues> {
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
  borderColor: "#555",
  border: `1px solid #DADADA`, // これを追加
  // "& .MuiInput-root": {
  //   borderColor: "#555",
  // },
  // フォーカス時のスタイル
  "&.Mui-focused": {
    // boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)', // フォーカス時の影
    border: `1px solid ${theme.palette.text.secondary}`,
    "& .MuiSvgIcon-root": {
      color: "text.primary",
    },
  },
});

export default function InputEmailArea<
  T extends { accountName: string } & FieldValues
>({ registerProps, errorProps, readonlyProps }: FormProps<T>) {
  // const [value, setValue] = useState<string>("test user"); // テスト表示用

  return (
    <Box sx={{ maxWidth: "600px", mt: "50px" }}>
      <FormControl variant="outlined" sx={{ width: "100%" }}>
        <InputLabel
          htmlFor="name"
          required
          sx={{ fontSize: "20px", fontWeight: "bold", left: "-10px" }}
        >
          Full Name
        </InputLabel>
        <CustomInput
          id="name"
          // value={value}
          disableUnderline={true}
          readOnly={readonlyProps}
          {...registerProps("accountName" as Path<T>)} // ここでregisterを適用
          error={Boolean(errorProps)} // MUIのエラー表示
          startAdornment={<InputAdornment position="start"></InputAdornment>}
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
