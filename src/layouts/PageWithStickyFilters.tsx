import React, { useState } from 'react';
import {
  Box,
  Collapse,
  Divider,
  Grid,
  IconButton,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Header from '../components/Header';

interface Props {
  title: string;
  filters: React.ReactNode;
  children: React.ReactNode;
}

export default function PageWithStickyFilters({ title, filters, children }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [filtersOpen, setFiltersOpen] = useState(!isMobile);
  const headerHeight = isMobile ? 56 : 64;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 ,  width: '100%',
    maxWidth: {
      xs: '100%',   // mobile
      sm: '95vw',
      md: '90vw',
      lg: '1200px', // desktop cap
    },}}>
      {/* Sticky Title + Filters */}
      <Box
        sx={{
          position: 'sticky',
          top: `${headerHeight}px`,
          zIndex: 1100,
          backgroundColor: theme.palette.background.paper,
          borderBottom: `1px solid ${theme.palette.divider}`,
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
         
        }}
      > 
        <Box px={2} pt={2}>
          <Typography variant="h5" gutterBottom>
            {title}
          </Typography>
         
        </Box>

        {isMobile ? (
          <Box px={2}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              onClick={() => setFiltersOpen((prev) => !prev)}
              sx={{ cursor: 'pointer', py: 1 }}
            >
              <Typography variant="subtitle1">Filters</Typography>
              <IconButton size="small">
                {filtersOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>

            <Collapse in={filtersOpen} timeout="auto" unmountOnExit>
              <Paper elevation={1} sx={{ p: 2 }}>
                <Grid container spacing={2}>{filters}</Grid>
              </Paper>
            </Collapse>
          </Box>
        ) : (
          <Box px={2} pb={2}>
            <Paper elevation={1} sx={{ p: 2 }}>
              <Grid container spacing={2}>{filters}</Grid>
            </Paper>
          </Box>
        )}

        <Divider />
      </Box>

      {/* Scrollable Content */}
      <Box
        component="section"
        sx={{
          flexGrow: 1,
          minHeight: 0,
          overflowY: 'auto',
          px: 2,
          py: 3,
           maxHeight: `65vh`,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
