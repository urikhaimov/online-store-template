import { Typography, Box } from '@mui/material';

export default function UnauthorizedPage() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h3">403 - Unauthorized</Typography>
      <Typography>You don’t have access to this page.</Typography>
    </Box>
  );
}
