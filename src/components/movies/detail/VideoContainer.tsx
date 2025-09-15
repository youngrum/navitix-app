import { Box, Typography } from "@mui/material";
import React from "react";

interface MovieContainerProps {
  trailerKeyProps: string | null;
}

function VideoContainer({ trailerKeyProps }: MovieContainerProps) {
  return (
    <>
      <Box
        sx={{
          borderRadius: 5,
          overflow: "hidden",
          position: "relative",
          aspectRatio: "16 / 9", // 16:9のアスペクト比を維持 (9 / 16 * 100)
        }}
      >
        {trailerKeyProps && (
          <iframe
            src={`https://www.youtube.com/embed/${trailerKeyProps}`}
            title="official video"
            allowFullScreen
            width="100%"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
          ></iframe>
        )}
      </Box>
    </>
  );
}

export default VideoContainer;
