import React from 'react';
import { CssBaseline, Container, Box, Typography } from '@mui/material';
import StoreSwitcher from './components/StoreSwitcher';
import StorePreview from './components/StorePreview';

function App() {
  return (
    <>
      <CssBaseline />
      <Container maxWidth="sm">
        <Box mt={6} mb={4} textAlign="center">
          <Typography variant="h4" fontWeight={700} gutterBottom>
            🛒 Configurable Online Store
          </Typography>
          <StoreSwitcher />
        </Box>

        <StorePreview />
      </Container>
    </>
  );
}

export default App;
