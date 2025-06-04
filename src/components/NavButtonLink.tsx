import React from 'react';
import { NavLink, NavLinkProps } from 'react-router-dom';
import { Button, ButtonProps } from '@mui/material';

type NavButtonLinkProps = ButtonProps & {
  to: string;
};

const NavButtonLink: React.FC<NavButtonLinkProps> = ({ to, children, ...props }) => {
  return (
    <NavLink to={to}>
      {({ isActive }) => (
        <Button
          {...props}
          sx={{
            color: 'white',
            opacity: isActive ? 1 : 0.7,
            fontWeight: isActive ? 600 : 400,
            textTransform: 'none',
            ...props.sx,
          }}
        >
          {children}
        </Button>
      )}
    </NavLink>
  );
};

export default NavButtonLink;
