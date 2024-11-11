'use client';
import React from 'react';
import {
    Container,
    Box
} from '@mui/material';
import { TopNavbar } from '../components/topNav';
import { AddExpenseButton } from '../components/addExpenseButton';

function Page() {
    return (
        <>
            <TopNavbar icon={ <></> } />
            <Container>
                <Box>
                    <h1>Group transaction page</h1>
                </Box>
            </Container>
            <AddExpenseButton />
        </>
    )
}

export default Page;