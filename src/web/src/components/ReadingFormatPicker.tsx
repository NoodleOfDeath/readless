import React from 'react';

import {
  mdiBookOpen,
  mdiFormatListBulleted,
  mdiTextLong,
} from '@mdi/js';
import { Icon } from '@mdi/react';
import {
  Button,
  Stack,
  styled,
  useTheme,
} from '@mui/material';

import { ReadingFormat } from '~/api';

type Props = {
  format?: ReadingFormat;
  onChange?: (format: ReadingFormat) => void;
};

const StyledStack = styled(Stack)(({ theme }) => ({
  background: theme.palette.background.default,
  border: `1px solid ${theme.palette.primary.main}`,
  borderRadius: 12,
  display: 'flex',
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
  border: `1px solid ${theme.palette.primary.main}`,
  borderRadius: 0,
  color: theme.palette.primary.main,
  cursor: 'pointer',
  textTransform: 'capitalize',
  width: '100%',
})); 

const FORMAT_ICONS: Record<ReadingFormat, string> = {
  [ReadingFormat.Bullets]: mdiFormatListBulleted,
  [ReadingFormat.FullArticle]: mdiBookOpen,
  [ReadingFormat.Summary]: mdiTextLong,
};

export default function ReadingFormatPicker({ format, onChange }: Props = {}) {
    
  const theme = useTheme();

  const ReadingFormatButton = React.useCallback((buttonFormat: ReadingFormat) => {
    return (
      <StyledButton
        sx={ {
          backgroundColor: format === buttonFormat ? theme.palette.primary.main : undefined,
          color: format === buttonFormat ? theme.palette.common.white : undefined, 
        } }
        startIcon={ <Icon path={ FORMAT_ICONS[buttonFormat] } size={ 1 } /> }
        onClick={ () => onChange?.(buttonFormat) }>
        {buttonFormat.replace(/([A-Z])/g, ' $1').trim()}
      </StyledButton>
    );
  }, [format, onChange, theme.palette.common.white, theme.palette.primary.main]);
  
  return (
    <StyledStack direction="row">
      {ReadingFormatButton(ReadingFormat.Summary)}
      {ReadingFormatButton(ReadingFormat.Bullets)}
      {ReadingFormatButton(ReadingFormat.FullArticle)}
    </StyledStack>
  );
}