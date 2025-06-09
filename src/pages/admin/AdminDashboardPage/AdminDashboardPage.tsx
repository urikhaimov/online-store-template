import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent, // ✅ added
} from '@mui/material';
import { useState } from 'react';
import { ThemePanel } from '../ThemePanel/ThemePanel';

const themes = ['light', 'dark', 'custom'];

export default function AdminDashboardPage() {
  const [selectedTheme, setSelectedTheme] = useState('light');

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedTheme(event.target.value);
    // TODO: Save theme
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
     
      
    </Box>
  );
}
