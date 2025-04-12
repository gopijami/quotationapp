// App.js
import React from 'react';
import { Container, Paper } from '@mui/material';
import Header from './componenets/Header';
import Footer from './componenets/Footer';
import Quotation from './componenets/Quotaation';

const App = () => {
    return (
        <Container maxWidth={false} sx={{width:"100vw"}}>
            <Header />
            <Paper elevation={3} sx={{ padding: 3, marginTop: 3 }}>
                <Quotation />
            </Paper>
            <Footer />
        </Container>
    );
};

export default App;
