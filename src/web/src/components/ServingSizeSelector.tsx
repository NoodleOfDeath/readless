import React from 'react';

import {
  Button,
  Grid,
  styled,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import { ServingSize } from '@/components/Summary';

type Props = {
  servingSize?: string;
  onChange?: (servingSize: ServingSize) => void;
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
}));

const StyledButton = styled(Button)<{ selected: boolean }>(({ theme, selected }) => ({
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

export default function ServingSizeSelector({
  servingSize,
  onChange,
}: Props = {}) {
    
  const theme = useTheme();
  const mdAndDown = useMediaQuery(theme.breakpoints.down('md'));
    
  const ServingButton = React.useCallback((size: ServingSize) => {
    return (
      <StyledButton
        variant="outlined"
        onClick={ () => onChange?.(size) }
        selected={ servingSize === size }>
        {size}
      </StyledButton>
    );
  }, [onChange, servingSize]);
  
  return (
    <StyledButtonGroup container>
      <Grid item xs={ mdAndDown ? 4 : 3 }>
        {ServingButton('bullets')}
      </Grid>
      <Grid item xs={ mdAndDown ? 4 : 3 }>
        {ServingButton('concise')}
      </Grid>
      <Grid item xs={ mdAndDown ? 4 : 3 }>
        {ServingButton('casual')}
      </Grid>
      <Grid item xs={ mdAndDown ? 12 : 3 }>
        {ServingButton('detailed')}
      </Grid>
    </StyledButtonGroup>
  );
}
