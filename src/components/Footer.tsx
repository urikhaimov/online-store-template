import {
  Box,
  Typography,
  IconButton,
  Link as MuiLink,
  useTheme,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { LocaleSwitcher } from './LocaleSwitcher';
import ThemeToggleButton from './ThemeToggleButton';
import { useThemeContext } from '../context/ThemeContext'; // 👈 import this

const Footer = () => {
  const { mode } = useThemeContext(); // 👈 get current mode

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: mode === 'dark' ? 'grey.900' : 'grey.100',
        color: mode === 'dark' ? 'grey.100' : 'text.primary',
        py: 3,
        px: 2,
        borderTop: '1px solid',
        borderColor: mode === 'dark' ? 'grey.800' : 'grey.300',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1.5,
      }}
    >
     
      <LocaleSwitcher />

      <Box display="flex" gap={1} alignItems="center">
        <EmailIcon fontSize="small" />
        <MuiLink
          href="mailto:contact@myonlinestore.com"
          underline="hover"
          sx={{ color: 'inherit' }}
        >
          contact@myonlinestore.com
        </MuiLink>
      </Box>

      <Box>
        <IconButton href="https://github.com/urikhaimov" target="_blank" rel="noopener" sx={{ color: 'inherit' }}>
          <GitHubIcon />
        </IconButton>
        <IconButton href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener" sx={{ color: 'inherit' }}>
          <LinkedInIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Footer;
