import { Box, CircularProgress, Modal, Typography } from "@mui/material";
import ForwardToInboxOutlinedIcon from "@mui/icons-material/ForwardToInboxOutlined";
import ReportGmailerrorredIcon from "@mui/icons-material/ReportGmailerrorred";
import NotificationImportantIcon from "@mui/icons-material/NotificationImportant";
import LockClockIcon from "@mui/icons-material/LockClock";

export interface ModalOpenProps {
  openProps: boolean;
  messageProps: string | "";
  messageHeaderProps: string | "";
  stausProps?: "mail-success" | "mail-error" | "locked" | "notice" | "progress";
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "60%",
  maxWidth: "300px",
  bgcolor: "background.paper",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
};

export default function NoticeMordal({
  openProps,
  messageProps,
  messageHeaderProps,
  stausProps = "mail-success",
}: ModalOpenProps) {
  const getIconAndColor = () => {
    switch (stausProps) {
      case "mail-success":
        return {
          icon: <ForwardToInboxOutlinedIcon fontSize="inherit" />,
          color: "secondary.main",
        };
      case "mail-error":
        return {
          icon: <ReportGmailerrorredIcon fontSize="inherit" />,
          color: "secondary.main",
        };
      case "locked":
        return {
          icon: <LockClockIcon fontSize="inherit" />,
          color: "secondary.main",
        };
      case "notice":
        return {
          icon: <NotificationImportantIcon fontSize="inherit" />,
          color: "secondary.main",
        };
      case "progress":
      default:
        return {
          icon: <CircularProgress color="secondary" />,
          color: "secondary.main",
        };
    }
  };
  const { icon } = getIconAndColor();

  return (
    <>
      <Modal
        open={openProps}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        slotProps={{
          backdrop: {
            sx: {
              backdropFilter: "blur(3px)",
              backgroundColor: "rgba(0, 0, 0, 0.6)", // ここで半透明な背景色を指定
            },
          },
        }}
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h5"
            color="secondary.main"
            sx={{ textAlign: "center" }}
          >
            {messageHeaderProps}
          </Typography>
          <Box sx={{ textAlign: "center", fontSize: "5rem", my: 1 }}>
            {icon}
          </Box>
          <Typography id="modal-modal-description" sx={{ fontSize: "14px" }}>
            {messageProps}
          </Typography>
        </Box>
      </Modal>
    </>
  );
}
