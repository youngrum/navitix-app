import { Box, InputAdornment, InputLabel, TextField, Typography } from '@mui/material';
import styled from "@emotion/styled";
import theme from '@/styles/theme';
import { FieldError, FieldValues, Path, UseFormRegister} from 'react-hook-form';
import { AccountCircle } from '@mui/icons-material';

interface FormProps<T extends { accountName: string } & FieldValues> {
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
    "& .MuiSvgIcon-root": {
      color: `${theme.palette.grey[600]}`,
    },
  },
})

export default function TextFieldNameArea<
  T extends { accountName: string } & FieldValues
>({ registerProps, errorProps, readonlyProps=false }: FormProps<T>) {

    return (
    <Box sx={{ mt: "50px" }}>
      <InputLabel
        htmlFor="Full Name"
        required
        sx={{ fontSize: "16px", fontWeight: "bold", bottom:1}}
      >Full Name</InputLabel>
      <CustomTextField
        id="input-with-icon-textfield"
        fullWidth
        error={Boolean(errorProps)}
        slotProps={{
          input: {
            readOnly: readonlyProps,
            startAdornment: (
              <InputAdornment position="start">
                <AccountCircle />
              </InputAdornment>
            ),
            
          },
        }}
        
        {...registerProps("accountName" as Path<T>)}
        variant="outlined"
      />
        {errorProps && (
          <Typography variant="h6" style={{ color: `${theme.palette.secondary.main}`, fontSize: "14px", paddingTop: "10px" }}>
            {errorProps.message}
          </Typography>
        )}
    </Box>
    );

}