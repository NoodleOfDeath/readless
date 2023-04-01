import React from 'react';

import {
  Button,
  Grid,
  styled,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import { ReadingFormat } from '@/api';

type Props = {
  onChange?: (format: ReadingFormat) => void;
};

const StyledButtonGroup = styled(Grid)(({ theme }) => ({
  alignItems: 'center',
  background: theme.palette.background.default,
  border: `1px solid ${theme.palette.primary.main}`,
  borderRadius: 8,
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  margin: theme.spacing(1),
  overflow: 'hidden',
  width: 'inherit',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  '&.Mui-selected': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  borderRadius: 0,
  color: theme.palette.primary.main,
  cursor: 'pointer',
  padding: theme.spacing(1),
  width: '100%',
})); 

export default function ReadingFormatSelector({ onChange }: Props = {}) {
    
  const theme = useTheme();
  const mdAndDown = useMediaQuery(theme.breakpoints.down('md'));
    
  const ServingButton = React.useCallback((buttonFormat: ReadingFormat) => {
    return (
      <StyledButton
        variant="outlined"
        onClick={ () => onChange?.(buttonFormat) }>
        {buttonFormat}
      </StyledButton>
    );
  }, [onChange]);
  
  return (
    <StyledButtonGroup container>
      <Grid item xs={ mdAndDown ? 4 : 2 }>
        {ServingButton(ReadingFormat.Bullets)}
      </Grid>
      <Grid item xs={ mdAndDown ? 4 : 2 }>
        {ServingButton(ReadingFormat.Concise)}
      </Grid>
      <Grid item xs={ mdAndDown ? 4 : 2 }>
        {ServingButton(ReadingFormat.Casual)}
      </Grid>
      <Grid item xs={ mdAndDown ? 6 : 2 }>
        {ServingButton(ReadingFormat.Detailed)}
      </Grid>
      <Grid item xs={ mdAndDown ? 6 : 2 }>
        {ServingButton(ReadingFormat.InDepth)}
      </Grid>
    </StyledButtonGroup>
  );
}
