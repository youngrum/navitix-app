import { styled } from "@mui/material/styles";
import {
  Control,
  Controller,
  FieldError,
  FieldValues,
  Path,
} from "react-hook-form";
import dayjs from "dayjs";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import type {} from "@mui/x-date-pickers/themeAugmentation";
import theme from "@/styles/theme";
import { Box, InputLabel, Typography } from "@mui/material";

interface FormProps<
  T extends { birthDay?: string | null | undefined } & FieldValues
> {
  control: Control<T>;
  errorProps?: FieldError;
  readonlyProps?: boolean;
}
// MobileDatePickerのデザイン定義
const CustomMobileDatePicker = styled(MobileDatePicker)({
  // 背景色とボーダーをカスタマイズ
  width: "100%",
  backgroundColor: "#f5f5f5",
  borderRadius: "4px",
  "& .MuiSvgIcon-root": {
    color: `${theme.palette.grey[400]}`,
  },
  // フォーカス時のスタイル
  "& .Mui-focused": {
    // boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)', // フォーカス時の影
    "& .MuiSvgIcon-root": {
      color: `${theme.palette.grey[600]}`,
    },
  },
  // 選択された日付の基本スタイル
  "& .MuiButtonBase-root.MuiPickersDay-root.Mui-selected": {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    fontWeight: 600,
    fontSize: "1.1rem",
  },

  // 選択された日付のホバー時
  "& .MuiButtonBase-root.MuiPickersDay-root.Mui-selected:hover": {
    backgroundColor: theme.palette.secondary.main,
  },

  // 選択された日付のフォーカス時
  "& .MuiButtonBase-root.MuiPickersDay-root:focus.Mui-selected": {
    backgroundColor: theme.palette.secondary.main,
    outline: `2px solid ${theme.palette.secondary.light}`,
    outlineOffset: "2px",
  },
});

export default function InputBirthdayArea<
  T extends { birthDay?: string | null | undefined } & FieldValues
>({ control, errorProps, readonlyProps }: FormProps<T>) {
  return (
    <Box sx={{ mt: "50px" }}>
      <InputLabel
        htmlFor="BirthDay"
        sx={{ fontSize: "16px", fontWeight: "bold", bottom: 1 }}
      >
        Birth Day
      </InputLabel>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Controller
          name={"birthDay" as Path<T>}
          control={control}
          render={({ field }) => (
            <CustomMobileDatePicker
              // 値の変換：フォーム値(string) → DatePicker値(Dayjs)
              value={field.value ? dayjs(field.value) : null}
              // 変更時の処理：DatePicker値(Dayjs) → フォーム値(string)
              onChange={(newValue) => {
                const formattedValue = newValue
                  ? newValue.format("YYYY-MM-DD")
                  : undefined;
                field.onChange(formattedValue); // ← フォームに値を設定
              }}
              onClose={field.onBlur}
              onAccept={field.onBlur}
              disableFuture
              format="YYYY-MM-DD"
              readOnly={readonlyProps}
              minDate={dayjs("1925-01-01")}
            />
          )}
        />
      </LocalizationProvider>
      {errorProps && (
        <Typography
          variant="h6"
          sx={{
            color: theme.palette.secondary.main,
            fontSize: "14px",
            paddingTop: "10px",
          }}
        >
          {errorProps.message}
        </Typography>
      )}
    </Box>
  );
}
