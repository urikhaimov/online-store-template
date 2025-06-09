// src/layouts/AdminPageLayout.tsx
import { Box, Typography } from '@mui/material';

type Props = {
  title: string;
  children: React.ReactNode;
};

export default function AdminPageLayout({ title, children }: Props) {
  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        {title}
      </Typography>
      {children}
    </Box>
  );
}
