import { Box, Typography, Paper } from '@mui/material';

import { useSafeAuth } from '../../hooks/getSafeAuth';
export default function UserProfilePage() {
  const { user } = useSafeAuth();

  if (!user) {
    return <Typography variant="h6">No user data available.</Typography>;
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
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
          <strong>UID:</strong> {user?.id}
        </Typography>
      </Paper>
    </Box>
  );
}
