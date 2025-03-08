// Header.js
import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';

const Header = () => (
    <AppBar position="static" color="primary">
        <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
                Quotation Application
            </Typography>
        </Toolbar>
    </AppBar>
);

export default Header;