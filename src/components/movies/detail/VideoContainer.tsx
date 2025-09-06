import { Box, Typography } from "@mui/material";
import React from "react";

interface MovieContainerProps {
  trailerKeyProps: string | null;
}

function VideoContainer({ trailerKeyProps }: MovieContainerProps) {
  return (
    <>
      <Typography variant="h2" color="textSecondary" sx={{ mt: 4 }}>
        トレーラー
      </Typography>
      <Box
        sx={{
          maxWidth: "500px",
          borderRadius: 5,
          overflow: "hidden",
        }}
      >
        {trailerKeyProps && (
          <iframe
            src={`https://www.youtube.com/embed/${trailerKeyProps}`}
            title="official video"
            allowFullScreen
            width="100%"
            style={{
              borderRadius: 5,
              overflow: "hidden",
            }}
          ></iframe>
        )}
      </Box>
    </>
  );
}

export default VideoContainer;
