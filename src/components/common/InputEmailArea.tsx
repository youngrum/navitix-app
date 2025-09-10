"use client";

import { FormControl,InputLabel, Input, InputAdornment, Box } from "@mui/material";
import EmailIcon from '@mui/icons-material/Email';
import { styled } from '@mui/material/styles';

// Inputのデザイン定義
const CustomInput = styled(Input)({
    // 背景色とボーダーをカスタマイズ
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    padding: '8px 12px',
    // フォーカス時のスタイル
    '&.Mui-focused': {
      // boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)', // フォーカス時の影
      '& .MuiSvgIcon-root': {
        color: 'text.primary',
      },
    }
})

export default function InputEmailArea () {

    return (
      <Box sx={{maxWidth:"500px"}}>
        <FormControl variant="outlined" sx={{width: "100%"}}>
          <InputLabel htmlFor="emailArea" required sx={{fontSize: "20px", fontWeight:"bold", left: "-10px"}}>Email</InputLabel>
          <CustomInput
            id="emailArea"
            disableUnderline={true}
            startAdornment={
              <InputAdornment position="start">
                <EmailIcon color="primary"/>
              </InputAdornment>
            }
            placeholder="example@gmail.com"
          />
        </FormControl>
      </Box>
    );
}