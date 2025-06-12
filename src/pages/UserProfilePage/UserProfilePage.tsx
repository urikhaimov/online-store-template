import { Box, Typography, Paper } from '@mui/material';

import { useSafeAuth } from '../../hooks/getSafeAuth';
export default function UserProfilePage() {
  const { user } = useSafeAuth();

  if (!user) {
    return <Typography variant="h6">No user data available.</Typography>;
  }

  return (
     <Box
          flexGrow={1}
          display="flex"
          justifyContent="center"
          alignItems="center"
          px={2}
          py={4}
          sx={{
            width: '100%', // Safe
            maxWidth: '100vw', // Prevent overflow
            overflowX: 'hidden', // Enforced here too
          }}
        >
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          My Profile
        </Typography>
        <Typography variant="body1">
          <strong>Display Name:</strong> {user?.name || 'N/A'}
        </Typography>
        <Typography variant="body1">
          <strong>Email:</strong> {user?.email}
        </Typography>
        <Typography variant="body1">
          <strong>UID:</strong> {user?.uid}
        </Typography>
      </Paper>
    </Box>
  );
}
