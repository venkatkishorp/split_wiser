import React from 'react';
import { Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from "next/navigation";

export function AddExpenseButton() {
    const router = useRouter();

    const handleAddExpense = () => {
        router.push('/addTrans');
    }

    return (
        <Button
            onClick={handleAddExpense}
            variant="contained"
            color="primary"
            sx={{
                position: 'fixed',
                bottom: 72,
                right: 16,
                zIndex: 1000
            }}>
            Add expense
        </Button>
    );
}