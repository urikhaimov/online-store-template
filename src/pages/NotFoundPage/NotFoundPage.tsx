import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import { useNavigate } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      display="flex" 
      flexDirection="column" 
      justifyContent="center" 
      alignItems="center"
      minHeight="100vh"
      textAlign="center"
      px={2}  /* horizontal padding for some breathing room on small screens */
    >
      {/* Icon or Image */}
      <SentimentVeryDissatisfiedIcon sx={{ fontSize: '6rem', mb: 2 }} color="primary" />
      
      {/* Main 404 Message */}
      <Typography variant="h4" component="h1" gutterBottom>
        404: Page Not Found
      </Typography>
      
      {/* Friendly description */}
      <Typography variant="body1" color="textSecondary" paragraph>
        Oops! The page you&#39;re looking for doesn’t exist.
      </Typography>
      
      {/* Home button to navigate back */}
      <Button variant="contained" color="primary" onClick={() => navigate('/')}>
        Back to Home
      </Button>
    </Box>
  );
};

export default NotFoundPage;
