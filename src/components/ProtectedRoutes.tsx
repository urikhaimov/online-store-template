import { Navigate } from 'react-router-dom';
import { useAuthSafe } from '../hooks/useAuthSafe';
import { getSafeAuth } from '../hooks/getSafeAuth';
import { CircularProgress, Box, Typography } from '@mui/material';
import { useIsAdmin } from '../hooks/useIsAdmin';
export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = getSafeAuth();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = getSafeAuth();
  const isAdmin = useIsAdmin();
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please log in</div>;
  }

  if (!isAdmin) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h5">Access Denied</Typography>
        <Typography>You do not have admin permissions.</Typography>
      </Box>
    );
  }

  return <>{children}</>;
};
