import { Typography } from "@mui/material";

export default async function page({params}: {params: {id: string}}){
    const theater_id = params.id;

    return (
        <Typography>{theater_id}</Typography>
    )
}