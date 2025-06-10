import {
  Box,
  Button,
  Typography,
  TextField,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useThemeSettings } from './useThemeSettings';

type ThemeFormValues = {
  primaryColor: string;
  secondaryColor: string;
  font: string;
  darkMode: boolean;
};
import AdminPageLayout from '../../../layouts/AdminPageLayout';
export function ThemePanel() {
  const { data: theme, saveTheme, isSaving } = useThemeSettings();

  const { register, handleSubmit, reset } = useForm<ThemeFormValues>({
    defaultValues: theme ?? {
      primaryColor: '#1976d2',
      secondaryColor: '#f50057',
      font: 'Roboto',
      darkMode: false,
    },
  });

  const onSubmit = (data: ThemeFormValues) => {
    saveTheme(data);
  };

  return (
    <AdminPageLayout title={'Theme Settings'}>


      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          label="Primary Color"
          type="color"
          fullWidth
          margin="normal"
          {...register('primaryColor')}
        />
        <TextField
          label="Secondary Color"
          type="color"
          fullWidth
          margin="normal"
          {...register('secondaryColor')}
        />
        <TextField
          label="Font"
          fullWidth
          margin="normal"
          {...register('font')}
        />
        <FormControlLabel
          control={<Switch {...register('darkMode')} />}
          label="Dark Mode"
        />
        <Box mt={2}>
          <Button type="submit" variant="contained" disabled={isSaving}>
            Save Theme
          </Button>
        </Box>
      </form>
    </AdminPageLayout>
  );
}
