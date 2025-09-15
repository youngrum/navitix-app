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
  FieldError,
  FieldValues,
  Path,
  Controller,
  Control,
} from "react-hook-form";
import dayjs, { Dayjs } from "dayjs";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import type {} from "@mui/x-date-pickers/themeAugmentation";
import theme from "@/styles/theme";

interface FormProps<
  T extends { birthDay?: string | null | undefined } & FieldValues
> {
  control: Control<T>;
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
>({ control, errorProps, readonlyProps }: FormProps<T>) {
  return (
    <Box sx={{ maxWidth: "600px", mt: "50px" }}>
      <FormControl variant="outlined" sx={{ width: "100%" }}>
        <FormLabel
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
          <Controller
            name={"birthDay" as Path<T>}
            control={control}
            render={({ field }) => (
              <CustomMobileDatePicker
                value={field.value ? dayjs(field.value) : null}
                onChange={(newValue) => {
                  const formattedValue = newValue
                    ? newValue.format("YYYY-MM-DD")
                    : null;
                  field.onChange(formattedValue);
                }}
                onClose={() => {
                  // DatePickerが閉じられた時にonBlurを呼び出す
                  field.onBlur();
                }}
                onAccept={() => {
                  // 日付が確定された時にonBlurを呼び出す
                  field.onBlur();
                }}
                disableFuture
                format="YYYY-MM-DD"
                readOnly={readonlyProps}
                minDate={dayjs("1925-01-01")}
              />
            )}
          />
        </LocalizationProvider>
        {errorProps && (
          <span
            style={{
              color: theme.palette.secondary.main,
              fontSize: "14px",
              paddingTop: "10px",
            }}
          >
            {errorProps.message}
          </span>
        )}
      </FormControl>
    </Box>
  );
}
