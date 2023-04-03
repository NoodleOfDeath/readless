import React from 'react';

import {
  mdiFormatListBulleted,
  mdiTextBox,
  mdiTextBoxMultiple,
  mdiTextLong,
  mdiTextShort,
} from '@mdi/js';
import { Icon } from '@mdi/react';
import {
  Button,
  Stack,
  styled,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import { ReadingFormat } from '~/api';

type Props = {
  onChange?: (format: ReadingFormat) => void;
};

const StyledStack = styled(Stack)(({ theme }) => ({
  background: theme.palette.background.default,
  border: `1px solid ${theme.palette.primary.main}`,
  borderRadius: 8,
  display: 'flex',
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

const FORMAT_ICONS: Record<ReadingFormat, string> = {
  [ReadingFormat.Bullets]: mdiFormatListBulleted,
  [ReadingFormat.Concise]: mdiTextShort,
  [ReadingFormat.Casual]: mdiTextLong,
  [ReadingFormat.Detailed]: mdiTextBox,
  [ReadingFormat.InDepth]: mdiTextBoxMultiple,
};

export default function ReadingFormatSelector({ onChange }: Props = {}) {
    
  const theme = useTheme();
  const mdAndDown = useMediaQuery(theme.breakpoints.down('md'));
    
  const ReadingFormatButton = React.useCallback((buttonFormat: ReadingFormat) => {
    return (
      <StyledButton
        variant="outlined"
        startIcon={ <Icon path={ FORMAT_ICONS[buttonFormat] } size={ 1 } /> }
        onClick={ () => onChange?.(buttonFormat) }>
        {buttonFormat}
      </StyledButton>
    );
  }, [onChange]);
  
  return (
    <StyledStack>
      {mdAndDown ? (
        <React.Fragment>
          <Stack direction="row">
            {ReadingFormatButton(ReadingFormat.Concise)}
            {ReadingFormatButton(ReadingFormat.Bullets)}
            {ReadingFormatButton(ReadingFormat.Casual)}
          </Stack>
          <Stack direction="row">
            {ReadingFormatButton(ReadingFormat.Detailed)}
            {ReadingFormatButton(ReadingFormat.InDepth)}
          </Stack>
        </React.Fragment>
      ) : (
        <Stack direction="row">
          {ReadingFormatButton(ReadingFormat.Concise)}
          {ReadingFormatButton(ReadingFormat.Bullets)}
          {ReadingFormatButton(ReadingFormat.Casual)}
          {ReadingFormatButton(ReadingFormat.Detailed)}
          {ReadingFormatButton(ReadingFormat.InDepth)}
        </Stack>
      )}
    </StyledStack>
  );
}
