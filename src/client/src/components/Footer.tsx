import React from 'react';
import { BottomNavigation, styled as muiStyled } from '@mui/material';

const StyledBottomNavigation = muiStyled(BottomNavigation)(({ theme }) => ({
  color: theme.palette.common.white,
  minHeight: 64,
  bottom: 0,
}));

export default function Footer() {
  return (
    <StyledBottomNavigation>
      Copyright &copy; {new Date().getFullYear()} ChatGPTalks
    </StyledBottomNavigation>
  );
}