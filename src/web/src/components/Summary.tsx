import React from 'react';

import { mdiCircle } from '@mdi/js';
import Icon from '@mdi/react';
import {
  Box,
  Card,
  CardContent,
  Divider,
  Link,
  List,
  ListItem,
  ListItemIcon,
  Stack,
  Typography,
  styled,
} from '@mui/material';
import { formatDistance } from 'date-fns';

import {
  InteractionType,
  PublicSummaryGroup,
  ReadingFormat,
} from '~/api';
import ReadingFormatSelector from '~/components/ReadingFormatSelector';
import { SessionContext } from '~/contexts';
import { useSummaryClient } from '~/core';

type Props = {
  summary: PublicSummaryGroup;
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
  padding: theme.spacing(1),
  textAlign: 'left',
}));

const StyledTitle = styled(Typography)(() => ({
  '&:hover': { textDecoration: 'underline' },
  cursor: 'pointer',
  fontWeight: 600,
  textDecoration: 'none',
}));

const StyledCategoryBox = styled(Stack)(({ theme }) => ({
  alignItems: 'center',
  flexGrow: 1,
  justifyContent: 'space-between',
  padding: theme.spacing(1),
}));

const StyledLink = styled(Link)(({ theme }) => ({ color: theme.palette.text.primary }));

const StyledDivider = styled(Divider)(({ theme }) => ({ marginTop: theme.spacing(1) }));

const StyledStack = styled(Stack)(() => ({ width: '100%' }));

export default function Summary({
  summary,
  initialFormat,
  tickIntervalMs = 60_000,
  onChange,
}: Props) {

  const { handleInteraction } = useSummaryClient();
  const { preferredReadingFormat } = React.useContext(SessionContext);

  const [format, setFormat] = React.useState(initialFormat);
  const [lastTick, setLastTick] = React.useState(new Date());

  const timeAgo = React.useMemo(
    () =>
      formatDistance(new Date(summary.originalDate ?? summary.createdAt ?? 0), lastTick, { addSuffix: true }),
    [summary.originalDate, summary.createdAt, lastTick]
  );

  // update time ago every `tickIntervalMs` milliseconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      setLastTick(new Date());
    }, tickIntervalMs);
    return () => clearInterval(interval);
  }, [tickIntervalMs]);

  const content = React.useMemo(() => {
    if (!summary || !initialFormat) {
      return null;
    }
    if (format === ReadingFormat.Summary) {
      return <Typography>{summary.summary}</Typography>;
    }
    return (
      <List>
        {summary.bullets?.map((bullet, index) => (
          <ListItem
            key={ index }>
            <ListItemIcon><Icon path={ mdiCircle } size={ 1 } /></ListItemIcon>
            <Typography>{bullet.replace(/^•\s*/, '')}</Typography>
          </ListItem>
        ))}
      </List>
    );
  }, [summary, initialFormat, format]);

  const handleFormatChange = React.useCallback(
    async (newFormat: ReadingFormat) => {
      setFormat(newFormat);
      onChange?.(newFormat);
      await handleInteraction(summary, InteractionType.Read, undefined, { format: newFormat });
    },
    [handleInteraction, onChange, summary]
  );

  return (
    <StyledCard onClick={ initialFormat ? undefined : () => handleFormatChange(preferredReadingFormat ?? ReadingFormat.Summary) }>
      <StyledStack spacing={ 2 }>
        <Stack direction="row" spacing={ 1 } flexGrow={ 1 }>
          <Typography variant="subtitle1">{summary.outlet.displayName}</Typography>
          <Box flexGrow={ 1 } />
        </Stack>
        <StyledStack direction='row' spacing={ 2 }>
          {summary.imageUrl && (
            <Box>
              <img src={ summary.imageUrl } alt={ summary.title } width={ 100 } height={ 100 } />
            </Box>
          )}
          <StyledStack flexGrow={ 1 }>
            <StyledTitle variant="h6">
              {summary.title}
            </StyledTitle>
            {initialFormat && (
              <Typography>{summary.shortSummary}</Typography>
            )}
            <Box flexGrow={ 1 } />
            <StyledCategoryBox direction="row" spacing={ 1 }>
              <Typography variant="subtitle1">{summary.category.displayName}</Typography>
              <StyledLink
                variant="subtitle1"
                href={ summary.url }
                target="_blank">
                View Original Article
              </StyledLink>
            </StyledCategoryBox>
          </StyledStack>
        </StyledStack>
        <StyledDivider variant="fullWidth" />
        <Stack direction='column' spacing={ 1 }>
          <Stack direction='row' flexGrow={ 1 } alignItems="center">
            <Typography variant="subtitle2">
              {timeAgo}
            </Typography>
            <Box flexGrow={ 1 } />
          </Stack>
          {initialFormat && (
            <ReadingFormatSelector 
              format={ format }
              onChange={ (newFormat) => handleFormatChange(newFormat) } />
          )}
        </Stack>
        {content && <CardContent>{content}</CardContent>}
      </StyledStack>
    </StyledCard>
  );
}
