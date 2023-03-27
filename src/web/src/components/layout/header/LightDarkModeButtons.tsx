import React from 'react';

import {
  mdiThemeLightDark,
  mdiWeatherNight,
  mdiWeatherSunny,
} from '@mdi/js';
import { Icon } from '@mdi/react';
import {
  Button,
  ButtonGroup,
  styled,
} from '@mui/material';

import { SessionContext } from '@/contexts';

const StyledButtonGroup = styled(ButtonGroup)`
  display: flex;
  align-self: center;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: auto;
`;

const StyledButton = styled(Button)<{ selected: boolean }>`
  background-color: ${({ theme, selected }) =>
    selected
      ? theme.palette.mode === 'light'
        ? theme.palette.secondary.light
        : theme.palette.secondary.dark
      : theme.palette.mode === 'light'
        ? theme.palette.primary.light
        : theme.palette.primary.dark};
  color: ${({ theme, selected }) =>
    selected ? theme.palette.text.primary : theme.palette.text.disabled};
  border: 1px solid
    ${({ theme }) =>
    theme.palette.mode === 'light'
      ? theme.palette.primary.dark
      : theme.palette.primary.light};
`;

export default function LightDarkModeButtons() {
  const {
    preferences: { displayMode },
    setDisplayMode,
  } = React.useContext(SessionContext);

  return (
    <StyledButtonGroup variant="outlined" aria-label="outlined button group">
      <StyledButton
        onClick={ () => setDisplayMode('light') }
        selected={ displayMode === 'light' }>
        <Icon path={ mdiWeatherSunny } size={ 1 } />
      </StyledButton>
      <StyledButton
        onClick={ () => setDisplayMode(undefined) }
        selected={ displayMode === undefined }>
        <Icon path={ mdiThemeLightDark } size={ 1 } />
      </StyledButton>
      <StyledButton
        onClick={ () => setDisplayMode('dark') }
        selected={ displayMode === 'dark' }>
        <Icon path={ mdiWeatherNight } size={ 1 } />
      </StyledButton>
    </StyledButtonGroup>
  );
}
