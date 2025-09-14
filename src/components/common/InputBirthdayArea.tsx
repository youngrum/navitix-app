"use client";

import {
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
  Box,
  FormLabel,
} from "@mui/material";

import { styled } from "@mui/material/styles";
import {
  UseFormRegister,
  FieldError,
  FieldValues,
  Path,
} from "react-hook-form";
import { ProfileFormValues, profileSchema } from "@/types/form";
import dayjs, { Dayjs } from "dayjs";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import type {} from "@mui/x-date-pickers/themeAugmentation";
import { useState } from "react";
import theme from "@/styles/theme";

interface FormProps<
  T extends { birthDay?: string | null | undefined } & FieldValues
> {
  registerProps: UseFormRegister<T>;
  errorProps?: FieldError;
  readonlyProps?: boolean;
}
// Inputのデザイン定義
const CustomMobileDatePicker = styled(MobileDatePicker)({
  // 背景色とボーダーをカスタマイズ
  backgroundColor: "#f5f5f5",
  borderRadius: "4px",
  // フォーカス時のスタイル
  "&.Mui-focused": {
    // boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)', // フォーカス時の影
    "& .MuiSvgIcon-root": {
      color: "text.primary",
    },
  },
});

export default function InputBirthdayArea<
  T extends { birthDay?: string | null | undefined } & FieldValues
>({ registerProps, errorProps, readonlyProps }: FormProps<T>) {
  const [value, setValue] = useState<Dayjs | null>(dayjs("2022-04-17")); // テスト表示用

  return (
    <Box sx={{ maxWidth: "600px", mt: "50px" }}>
      <FormControl variant="outlined" sx={{ width: "100%" }}>
        <FormLabel
          required
          sx={{
            fontSize: "16px",
            fontWeight: "bold",
            left: "5px",
            bottom: "5px",
          }}
        >
          Day of Birth
        </FormLabel>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <CustomMobileDatePicker
            value={value}
            onChange={(newValue) => {
              setValue(newValue);
              // react-hook-formにも値を設定
              const { onChange } = registerProps("birthDay" as Path<T>);
              onChange({
                target: {
                  value: newValue ? newValue.format("YYYY-MM-DD") : "",
                },
              });
            }}
            disableFuture
            format="YYYY-MM-DD"
            readOnly={readonlyProps}
          ></CustomMobileDatePicker>
        </LocalizationProvider>
        {errorProps && (
          <span style={{ color: "red", fontSize: "14px", paddingTop: "10px" }}>
            {errorProps.message}
          </span>
        )}
      </FormControl>
    </Box>
  );
}
