import React from 'react';

import {
  Button,
  ButtonGroup,
  styled,
} from '@mui/material';

import { CONSUMPTION_MODES, ConsumptionMode } from '@/components/Post';

type Props = {
  consumptionMode?: string;
  onChange?: (mode: ConsumptionMode) => void;
};

const StyledButtonGroup = styled(ButtonGroup)(({ theme }) => ({
  alignItems: 'center',
  background: theme.palette.background.default,
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  margin: theme.spacing(1),
}));

const StyledButton = styled(Button)<{ selected: boolean }>(
  ({ theme, selected }) => ({
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
    },
    backgroundColor: selected ? theme.palette.primary.main : 'transparent',
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: theme.spacing(1),
    color: selected ? theme.palette.common.white : theme.palette.primary.main,
    cursor: 'pointer',
    padding: theme.spacing(1),
  }),
);

export default function ConsumptionModeSelector({
  consumptionMode,
  onChange,
}: Props = {}) {
  
  return (
    <StyledButtonGroup variant="outlined" aria-label="outlined button group">
      {CONSUMPTION_MODES.map((mode) => (
        <StyledButton
          key={ mode }
          onClick={ () => onChange?.(mode) }
          selected={ mode === consumptionMode }>
          {mode}
        </StyledButton>
      ))}
    </StyledButtonGroup>
  );
}
