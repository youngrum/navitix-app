import { Box, CircularProgress, Modal, Typography } from "@mui/material";
import ForwardToInboxOutlinedIcon from "@mui/icons-material/ForwardToInboxOutlined";
import ReportGmailerrorredIcon from "@mui/icons-material/ReportGmailerrorred";
import NotificationImportantIcon from "@mui/icons-material/NotificationImportant";
import LockClockIcon from "@mui/icons-material/LockClock";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

export interface ModalOpenProps {
  openProps: boolean;
  messageProps: string | "";
  messageHeaderProps: string | "";
  stausProps?:
    | "success"
    | "mail-success"
    | "mail-error"
    | "locked"
    | "notice"
    | "progress";
  onCloseProps: () => void;
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

export default function NoticeModal({
  openProps,
  messageProps,
  messageHeaderProps,
  stausProps = "mail-success",
  onCloseProps,
}: ModalOpenProps) {
  const getIconAndColor = () => {
    switch (stausProps) {
      case "success":
        return {
          icon: <CheckCircleOutlineIcon fontSize="inherit" color="secondary" />,
        };
      case "mail-success":
        return {
          icon: (
            <ForwardToInboxOutlinedIcon fontSize="inherit" color="secondary" />
          ),
        };
      case "mail-error":
        return {
          icon: (
            <ReportGmailerrorredIcon fontSize="inherit" color="secondary" />
          ),
        };
      case "locked":
        return {
          icon: <LockClockIcon fontSize="inherit" color="secondary" />,
        };
      case "notice":
        return {
          icon: (
            <NotificationImportantIcon fontSize="inherit" color="secondary" />
          ),
        };
      case "progress":
      default:
        return {
          icon: <CircularProgress color="secondary" />,
        };
    }
  };
  const { icon } = getIconAndColor();

  const handleContentClick = () => {
    // progress状態ではない場合のみ、モーダルを閉じる処理を実行
    if (stausProps !== "progress") {
      onCloseProps();
    }
  };

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
              backgroundColor: "rgba(0, 0, 0, 0.6)",
            },
          },
        }}
      >
        <Box sx={style} onClick={handleContentClick}>
          <Typography
            id="modal-modal-title"
            variant="h5"
            color="secondary.main"
            sx={{ textAlign: "center" }}
          >
            {messageHeaderProps}
          </Typography>
          <Box
            sx={{
              textAlign: "center",
              fontSize: "5rem",
              my: 1,
            }}
          >
            {icon}
          </Box>
          <Typography
            id="modal-modal-description"
            sx={{ fontSize: "14px", whiteSpace: "pre-wrap" }}
          >
            {messageProps}
          </Typography>
        </Box>
      </Modal>
    </>
  );
}
