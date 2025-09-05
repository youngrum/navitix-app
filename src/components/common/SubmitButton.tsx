'use client';

import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

interface SubmitButtonProps {
    isLoading: boolean;
    buttonText: string;
}

export default function SubmitButton ({ isLoading, buttonText }: SubmitButtonProps) {

    return(
        <Button type='submit' variant='contained' disabled ={isLoading}>
            {isLoading ? <CircularProgress size={24} color="inherit" /> : buttonText}
        </Button>
    );
}
