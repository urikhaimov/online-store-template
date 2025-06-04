import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'grey.100',
        py: 2,
        px: 2,
        mt: 'auto',
        width: '100%',
        borderTop: '1px solid #ddd',
        textAlign: 'center',
      }}
    >
      <Typography variant="body2" color="text.secondary">
        © {new Date().getFullYear()} My Online Store. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
