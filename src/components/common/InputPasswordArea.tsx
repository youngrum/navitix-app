"use client";

import { FormControl,InputLabel, InputAdornment, Box, IconButton, Input,  } from "@mui/material";
import {VisibilityOff, Visibility } from '@mui/icons-material/';
import LockIcon from '@mui/icons-material/Lock';

import { useState } from 'react';

export default function InputPasswordArea () {

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };
  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

    return (
      <Box sx={{maxWidth:"500px"}}>
        <FormControl variant="outlined" sx={{width: "100%"}}>
          <InputLabel htmlFor="PasswordArea" required sx={{fontSize: "20px", fontWeight:"bold", left: "-10px"}}>Password</InputLabel>
          <Input
            required
            id="PasswordArea"
            disableUnderline={true}
            sx={{
              // 背景色とボーダーをカスタマイズ
              backgroundColor: '#f5f5f5',
              borderRadius: '8px',
              border: 'none',
              padding: '8px 12px',

              // フォーカス時のスタイル
              '&.Mui-focused': {
                // boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)', // フォーカス時の影
                '& .MuiSvgIcon-root': {
                  color: 'text.primary',
                },
              }
            }}
            startAdornment={
              <InputAdornment position="start">
                <LockIcon color="primary"/>
              </InputAdornment>
            }
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  color="primary"
                  aria-label={
                    showPassword ? 'hide the password' : 'display the password'
                  }
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  onMouseUp={handleMouseUpPassword}
                  >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            type={showPassword ? 'text' : 'password'}
            placeholder="your password"
          />
        </FormControl>

      </Box>
    );
}