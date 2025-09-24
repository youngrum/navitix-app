import {
  Box,
  InputAdornment,
  InputLabel,
  TextField,
  Typography,
} from "@mui/material";
import styled from "@emotion/styled";
import theme from "@/styles/theme";
import {
  FieldError,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";
import EmailIcon from "@mui/icons-material/Email";

interface FormProps<T extends { email: string } & FieldValues> {
  registerProps: UseFormRegister<T>;
  errorProps?: FieldError;
  readonlyProps?: boolean;
}

const CustomTextField = styled(TextField)({
  backgroundColor: `${theme.palette.grey[100]}`,
  borderRadius: 1,
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
});

export default function InputEmailArea<
  T extends { email: string } & FieldValues
>({ registerProps, errorProps, readonlyProps = false }: FormProps<T>) {
  return (
    <Box sx={{ mt: "50px" }}>
      <InputLabel
        htmlFor="Email"
        required
        sx={{ fontSize: "16px", fontWeight: "bold", bottom: 1 }}
      >
        Email
      </InputLabel>
      <CustomTextField
        id="Email"
        fullWidth
        error={Boolean(errorProps)}
        slotProps={{
          input: {
            readOnly: readonlyProps,
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon />
              </InputAdornment>
            ),
          },
        }}
        {...registerProps("email" as Path<T>)}
        variant="outlined"
      />
      {errorProps && (
        <Typography
          variant="h6"
          style={{
            color: `${theme.palette.secondary.main}`,
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
