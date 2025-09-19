import { Typography } from "@mui/material";

export async function page({params}: {params: {id: number}}){
    const theater_id = params.id;

    return (
        <Typography>{theater_id}</Typography>
    )
}