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
  FieldValues,
  FieldError,
  FieldErrorsImpl,
  Merge,
} from "react-hook-form";

interface formProps {
  registerProps: UseFormRegister<any>;
  errorProps?: FieldError;
}
// Inputのデザイン定義
const CustomInput = styled(Input)({
  // 背景色とボーダーをカスタマイズ
  backgroundColor: "#f5f5f5",
  borderRadius: "8px",
  padding: "8px 12px",
  // フォーカス時のスタイル
  "&.Mui-focused": {
    // boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)', // フォーカス時の影
    "& .MuiSvgIcon-root": {
      color: "text.primary",
    },
  },
});

export default function InputEmailArea({
  registerProps,
  errorProps,
}: formProps) {
  return (
    <Box sx={{ maxWidth: "500px", mt: "50px" }}>
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
          {...registerProps("email")} // ここでregisterを適用
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
