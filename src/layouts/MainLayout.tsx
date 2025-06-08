
import { Box } from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/Footer';
interface Props {
    children: React.ReactNode;
}
export default function Layout({ children }: Props) {

    return (
        <Box
            display="flex"
            flexDirection="column"
            minHeight="100vh"
            minWidth={'100vw'} // Ensure full width
            sx={{
                overflowX: 'hidden', // 🧼 Prevent horizontal scroll
            }}
        >
            <Header />
            <Box component="main" flexGrow={1}>
                {children }
            </Box>
            <Footer />
        </Box>

    );
}
