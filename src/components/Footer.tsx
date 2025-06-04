import { Box, Typography, IconButton, Link as MuiLink } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { LocaleSwitcher } from './LocaleSwitcher';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'grey.100',
        py: 3,
        px: 2,
        mt: 'auto',
        borderTop: '1px solid #ccc',
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
        <MuiLink href="mailto:contact@myonlinestore.com" underline="hover">
          contact@myonlinestore.com
        </MuiLink>
      </Box>

      <Box>
        <IconButton href="https://github.com/urikhaimov" target="_blank" rel="noopener">
          <GitHubIcon />
        </IconButton>
        <IconButton href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener">
          <LinkedInIcon />
        </IconButton>
        {/* Add more if needed */}
      </Box>

      {/* <Typography variant="body2" color="text.secondary">
        © {new Date().getFullYear()} My Online Store
      </Typography> */}
    </Box>
  );
};

export default Footer;
