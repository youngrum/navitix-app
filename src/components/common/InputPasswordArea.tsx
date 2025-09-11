"use client";

import {
  FormControl,
  InputLabel,
  InputAdornment,
  Box,
  IconButton,
  Input,
} from "@mui/material";
import { VisibilityOff, Visibility } from "@mui/icons-material/";
import LockIcon from "@mui/icons-material/Lock";
import styled from "@emotion/styled";
import { useState } from "react";
import { UseFormRegister, FieldValues, FieldError } from "react-hook-form";

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

export default function InputPasswordArea({
  registerProps,
  errorProps,
}: formProps) {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
  const handleMouseUpPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <Box sx={{ maxWidth: "500px", mt:"50px" }}>
      <FormControl variant="outlined" sx={{ width: "100%" }}>
        <InputLabel
          htmlFor="password"
          required
          sx={{ fontSize: "20px", fontWeight: "bold", left: "-10px" }}
        >
          Password
        </InputLabel>
        <CustomInput
          id="password"
          {...registerProps("password")} // ここでregisterを適用
          error={Boolean(errorProps)} // MUIのエラー表示
          disableUnderline={true}
          startAdornment={
            <InputAdornment position="start">
              <LockIcon color="primary" />
            </InputAdornment>
          }
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                color="primary"
                aria-label={
                  showPassword ? "hide the password" : "display the password"
                }
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                onMouseUp={handleMouseUpPassword}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          type={showPassword ? "text" : "password"}
          placeholder="your password"
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
