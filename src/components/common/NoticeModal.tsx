import { Box, Button, Modal, Typography } from "@mui/material";
import { useState } from "react";
import ForwardToInboxOutlinedIcon from "@mui/icons-material/ForwardToInboxOutlined";

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

export default function NoticeMordal() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true); // モーダルデザイン実装用
  const handleClose = () => setOpen(false); // モーダルデザイン実装用

  return (
    <>
      <Button onClick={handleOpen}>Open modal</Button>
      <Modal
        open={open}
        onClose={handleClose}
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
            Mail was Sent !
          </Typography>
          <Box sx={{ textAlign: "center", fontSize: "5rem", my: 1 }}>
            <ForwardToInboxOutlinedIcon color="secondary" fontSize="inherit" />
          </Box>
          <Typography id="modal-modal-description" sx={{ fontSize: "14px" }}>
            会員登録用メールを発行しました。メール内、認証リンクより会員登録手続きをしてください。
          </Typography>
        </Box>
      </Modal>
    </>
  );
}
