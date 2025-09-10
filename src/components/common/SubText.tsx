"use client"; 
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material";

interface subTextProps {
    subText: string;
}
export default function SubText ({subText}: subTextProps){
    const theme = useTheme();

    return (
    <Box>
    {/* clamp(最小値, 推奨値, 最大値) */}
    <Typography variant="body2" sx={{ color: theme.palette.text.secondary, textAlign:"center", fontSize: "clamp(1rem, 2.5vw, 1.5rem)"}}>
        {subText}
    </Typography>
    </Box>
);

}