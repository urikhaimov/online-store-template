import { Box } from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        overflowX: 'hidden',
      }}
    >
      <Header /> {/* ✅ this is your top navbar with logo, links, etc. */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',        // ✅ horizontally center children
          width: '100vw',
          overflow: 'visible',
        
        }}
      >
        {children} {/* This will include <PageWithStickyFilters> */}
      </Box>

      <Footer /> {/* ✅ this should remain visible at bottom */}
    </Box>

  );
}
