import { Box, IconButton, InputAdornment, InputLabel, TextField, Typography } from '@mui/material';
import styled from "@emotion/styled";
import theme from '@/styles/theme';
import { FieldError, FieldValues, Path, UseFormRegister} from 'react-hook-form';
import LockIcon from "@mui/icons-material/Lock";
import { useState } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';

interface FormProps<T extends { password: string } & FieldValues> {
  registerProps: UseFormRegister<T>;
  errorProps?: FieldError;
  readonlyProps?: boolean;
}

const CustomTextField = styled(TextField)({
  backgroundColor: `${theme.palette.grey[100]}`,
  borderRadius: "4px",
  "& .MuiSvgIcon-root": {
      color: `${theme.palette.grey[400]}`,
    },
    // フォーカス時のスタイル
  "& .Mui-focused": {
    // boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)', // フォーカス時の影
    borderColor: `${theme.palette.grey[400]}`,
    "& .MuiSvgIcon-root": {
      color: `${theme.palette.grey[600]}`,
    },
  },
})

export default function TextFieldPasswordArea<
  T extends { password: string } & FieldValues
>({ registerProps, errorProps, readonlyProps=false }: FormProps<T>) {
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    return (
    <Box sx={{ mt: "50px" }}>
      <InputLabel
        htmlFor="Password"
        required
        sx={{ fontSize: "16px", fontWeight: "bold", bottom:1}}
      >Password</InputLabel>
      <CustomTextField
        id="input-with-icon-textfield"
        fullWidth
        error={Boolean(errorProps)}
        type={showPassword ? "text" : "password"}
        slotProps={{
          input: {
            readOnly: readonlyProps,
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon  />
              </InputAdornment>
            ),
            endAdornment:(
            <InputAdornment position="end">
              <IconButton
                color="primary"
                aria-label={
                  showPassword ? "hide the password" : "display the password"
                }
                onClick={handleClickShowPassword}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
            ),
            placeholder:"your password"
          },
        }}
        
        {...registerProps("password" as Path<T>)}
        variant="outlined"
      />
        {errorProps && (
          <Typography variant="h6" style={{ color: theme.palette.secondary.main, fontSize: "14px", paddingTop: "10px" }}>
            {errorProps.message}
          </Typography>
        )}
    </Box>
    );

}