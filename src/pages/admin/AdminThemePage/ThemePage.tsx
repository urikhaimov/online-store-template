import { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import ThemeForm from '../../../context/ThemeForm';
import { getThemeSettings, updateThemeSettings, ThemeSettings } from '../../../api/theme';
import AdminPageLayout from '../../../layouts/AdminPageLayout';
export default function AdminThemePage() {
  const storeId = localStorage.getItem('storeId') || 'store1';
  const [theme, setTheme] = useState<ThemeSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getThemeSettings(storeId)
      .then(setTheme)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [storeId]);

  const handleSave = async (updated: ThemeSettings) => {
    try {
      setSaving(true);
      await updateThemeSettings(storeId, updated);
      setTheme(updated);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <AdminPageLayout title={' Admin Dashboard – Theme Manager'}>
      {theme && <ThemeForm initialTheme={theme} onSave={handleSave} isSaving={saving} />}
    </AdminPageLayout>
  );
}
