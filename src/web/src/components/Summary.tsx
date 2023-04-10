import React from 'react';

import {
  mdiBookmarkBoxOutline,
  mdiChevronLeft,
  mdiEye,
  mdiShare,
} from '@mdi/js';
import Icon from '@mdi/react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Link,
  Stack,
  Typography,
  styled,
} from '@mui/material';
import { formatDistance } from 'date-fns';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';

import {
  InteractionType,
  PublicSummaryAttributes,
  ReadingFormat,
} from '~/api';
import ReadingFormatSelector from '~/components/ReadingFormatSelector';
import TruncatedText from '~/components/common/TruncatedText';
import { SessionContext } from '~/contexts';

type Props = {
  summary: PublicSummaryAttributes;
  initialFormat?: ReadingFormat;
  tickIntervalMs?: number;
  onChange?: (mode?: ReadingFormat) => void;
  onInteract?: (type: InteractionType, content?: string, metadata?: Record<string, unknown>) => void;
};

const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'left',
  minWidth: 200,
  overflow: 'visible',
  padding: theme.spacing(2),
  textAlign: 'left',
}));

const StyledTitle = styled(Typography)(() => ({
  '&:hover': { textDecoration: 'underline' },
  cursor: 'pointer',
  fontWeight: 600,
  textDecoration: 'none',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  background: theme.palette.primary.main,
  border: theme.palette.secondary.main,
  borderRadius: 20,
  color: theme.palette.primary.contrastText,
  height: 40,
  paddingRight: theme.spacing(5),
}));

const StyledBackButton = styled(StyledButton)(({ theme }) => ({
  left: theme.spacing(2),
  opacity: 0.8,
  position: 'fixed',
  top: theme.spacing(10),
}));

const StyledReadingFormatContainer = styled(Box)<Partial<Props>>(({ theme, initialFormat: format }) => ({
  borderRadius: 8,
  bottom: format && theme.breakpoints.down('md') ? theme.spacing(4) : undefined,
  position: format ? 'fixed' : 'relative',
  right: format ? theme.spacing(4) : undefined,
  top: format && !theme.breakpoints.down('md') ? theme.spacing(10) : undefined,
}));

const StyledCategoryBox = styled(Stack)(({ theme }) => ({
  alignItems: 'center',
  background: theme.palette.primary.main,
  borderRadius: 8,
  color: theme.palette.primary.contrastText,
  justifyContent: 'space-between',
  marginBottom: theme.spacing(1),
  padding: theme.spacing(1),
  width: '100%',
}));

const StyledLink = styled(Link)(({ theme }) => ({ color: theme.palette.primary.contrastText }));

const StyledDivider = styled(Divider)(({ theme }) => ({ marginTop: theme.spacing(1) }));

const StyledStack = styled(Stack)(() => ({ width: '100%' }));

export default function Summary({
  summary,
  initialFormat,
  tickIntervalMs = 60_000,
  onChange,
  onInteract,
}: Props) {

  const { preferences: { preferredReadingFormat } } = React.useContext(SessionContext);

  const [format, setFormat] = React.useState(initialFormat ?? preferredReadingFormat ?? ReadingFormat.Concise);
  const [lastTick, setLastTick] = React.useState(new Date());

  const timeAgo = React.useMemo(
    () =>
      formatDistance(new Date(summary.createdAt ?? 0), lastTick, { addSuffix: true }),
    [summary.createdAt, lastTick]
  );

  // update time ago every `tickIntervalMs` milliseconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      setLastTick(new Date());
    }, tickIntervalMs);
    return () => clearInterval(interval);
  }, [tickIntervalMs]);

  const content = React.useMemo(() => {
    if (!summary) {
      return null;
    }
    let text = '';
    switch (format) {
    case 'bullets':
      text = summary.bullets.join('\n');
      break;
    case 'concise':
      text = summary.shortSummary;
      break;
    case 'casual':
      text = summary.summary;
      break;
    case 'detailed':
      text = summary.longSummary;
      break;
    default:
      text = summary.text;
    }
    return (
      <ReactMarkdown>{text}</ReactMarkdown>
    );
  }, [summary, format]);

  const handleFormatChange = React.useCallback(
    (newFormat: ReadingFormat) => {
      setFormat(newFormat);
      onChange?.(newFormat);
    },
    [onChange]
  );

  return (
    <StyledCard>
      {initialFormat !== undefined && (
        <StyledBackButton
          onClick={ () => onChange?.() }
          startIcon={
            <Icon path={ mdiChevronLeft } size={ 2 } /> 
          }>
          Back to Results
        </StyledBackButton>
      )}
      <StyledStack>
        <StyledStack direction='row' spacing={ 2 }>
          <StyledStack flexGrow={ 1 }>
            <StyledCategoryBox direction="row" spacing={ 1 }>
              <Typography variant="subtitle1">{summary.categoryAttributes?.displayName ?? 'category'}</Typography>
              <Box flexGrow={ 1 } />
              <StyledButton 
                startIcon={ <Icon path={ mdiBookmarkBoxOutline } size={ 1 } /> } 
                onClick={ () => onInteract?.(InteractionType.Bookmark) }>
                Read Later
              </StyledButton>
            </StyledCategoryBox>
            <Stack direction="row" spacing={ 1 } flexGrow={ 1 }>
              <Typography variant="subtitle1">{summary.outletAttributes?.displayName}</Typography>
              <Box flexGrow={ 1 } />
              <StyledLink
                variant="subtitle1"
                href={ summary.url }
                target="_blank"
                color="inherit">
                View Original Source
              </StyledLink>
            </Stack>
            <StyledTitle variant="h6" onClick={ () => onChange?.(preferredReadingFormat ?? ReadingFormat.Concise) }>
              <TruncatedText maxCharCount={ 200 }>{summary.title}</TruncatedText>
            </StyledTitle>
          </StyledStack>
        </StyledStack>
        <StyledDivider variant="fullWidth" />
        <Stack direction='column' spacing={ 1 }>
          <Stack direction='row' flexGrow={ 1 } alignItems="center">
            <Typography variant="subtitle2">{timeAgo}</Typography>
            <Box flexGrow={ 1 } />
            <Stack direction='row' spacing={ 1 } alignItems="center">
              <Typography variant="subtitle2">{ summary.interactions.view ?? '...' }</Typography>
              <Icon path={ mdiEye } size={ 1 } />
              <Button startIcon={ <Icon path={ mdiShare } size={ 1 } /> } />
            </Stack>
          </Stack>
          <StyledReadingFormatContainer initialFormat={ initialFormat }>
            <ReadingFormatSelector onChange={ (newFormat) => handleFormatChange(newFormat) } />
          </StyledReadingFormatContainer>
        </Stack>
        {initialFormat !== undefined && <CardContent>{content}</CardContent>}
      </StyledStack>
    </StyledCard>
  );
}
