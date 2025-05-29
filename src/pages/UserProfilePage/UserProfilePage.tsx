import { Box, Typography, Paper } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';

export default function UserProfilePage() {
  const { user } = useAuth();

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
          <strong>Display Name:</strong> {user.displayName || 'N/A'}
        </Typography>
        <Typography variant="body1">
          <strong>Email:</strong> {user.email}
        </Typography>
        <Typography variant="body1">
          <strong>UID:</strong> {user.uid}
        </Typography>
      </Paper>
    </Box>
  );
}
