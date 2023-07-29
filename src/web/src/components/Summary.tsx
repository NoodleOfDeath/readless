import React from 'react';

import { mdiCircle } from '@mdi/js';
import Icon from '@mdi/react';
import {
  Box,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  Stack,
  Typography,
  styled,
} from '@mui/material';
import { formatDistance } from 'date-fns';
import ms from 'ms';
import pluralize from 'pluralize';

import { MeterDial } from './MeterDial';

import {
  InteractionType,
  PublicSummaryGroup,
  ReadingFormat,
} from '~/api';
import ReadingFormatPicker from '~/components/ReadingFormatPicker';
import { SessionContext } from '~/contexts';
import {
  fixedSentiment,
  publisherIcon,
  useSummaryClient,
} from '~/core';

type Props = {
  big?: boolean;
  summary: PublicSummaryGroup;
  initialFormat?: ReadingFormat;
  tickIntervalMs?: number;
  onChange?: (format?: ReadingFormat) => void;
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
  lineHeight: 1.4,
  textDecoration: 'none',
}));

const StyledDivider = styled(Divider)(({ theme }) => ({ marginTop: theme.spacing(1) }));

const StyledStack = styled(Stack)(() => ({ width: '100%' }));

export default function Summary({
  big,
  summary,
  initialFormat,
  tickIntervalMs = ms('5m'),
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
            <ListItemIcon>
              <Icon path={ mdiCircle } size={ 1 } />
            </ListItemIcon>
            <Typography>{bullet.replace(/^•\s*/, '')}</Typography>
          </ListItem>
        ))}
      </List>
    );
  }, [summary, initialFormat, format]);

  const imageUrl = React.useMemo(() => {
    if (summary.media?.imageArticle) {
      return summary.media.imageArticle;
    }
    return summary.media?.imageAi1 || summary.imageUrl;
  }, [summary]);

  const handleFormatChange = React.useCallback(
    async (newFormat: ReadingFormat) => {
      if (newFormat === ReadingFormat.FullArticle) {
        window.open(summary.url, '_blank');
        return;
      }
      setFormat(newFormat);
      onChange?.(newFormat);
      await handleInteraction(summary, InteractionType.Read, undefined, { format: newFormat });
    },
    [handleInteraction, onChange, summary]
  );

  return (
    <StyledCard onClick={ initialFormat ? undefined : () => handleFormatChange(preferredReadingFormat ?? ReadingFormat.Summary) }>
      <StyledStack spacing={ 2 }>
        {big && imageUrl && (
          <Box>
            <div style={ {
              backgroundImage: `url(${imageUrl})`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              borderRadius: 8, 
              height: 300, 
              width: '100%', 
            } } />
          </Box>
        )}
        <Stack 
          direction="row"
          spacing={ 1 }
          flexGrow={ 1 }
          alignItems={ 'center' }>
          <img 
            src={ publisherIcon(summary.publisher) }
            alt={ summary.publisher.displayName }
            width={ 24 }
            height={ 24 }
            style={ { borderRadius: '50%' } } />
          <Typography variant="subtitle2">{summary.publisher.displayName}</Typography>
          <Typography variant="subtitle2">·</Typography>
          <Typography variant="subtitle2">
            {timeAgo}
          </Typography>
          <Box flexGrow={ 1 } />
          <Typography variant="subtitle2">
            {fixedSentiment(summary.sentiment)}
          </Typography>
          <MeterDial value={ summary.sentiment } width={ 40 } />
        </Stack>
        <StyledStack direction='row' spacing={ 2 }>
          <StyledStack flexGrow={ 1 }>
            <StyledTitle variant="subtitle1">
              {summary.title}
            </StyledTitle>
            <Typography variant="body2">{summary.shortSummary}</Typography>
            <Box flexGrow={ 1 } />
          </StyledStack>
          {!big && imageUrl && (
            <Box>
              <div style={ {
                backgroundImage: `url(${imageUrl})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                borderRadius: 8, 
                height: 100, 
                width: 100, 
              } } />
            </Box>
          )}
        </StyledStack>
        <Stack direction='column' spacing={ 2 }>
          <Stack direction='row' flexGrow={ 1 } alignItems="center" spacing={ 1 }>
            <Typography variant="subtitle2">{summary.category.displayName}</Typography>
            <Typography variant="subtitle2">·</Typography>
            <Typography variant="subtitle2">
              {pluralize('Article', (summary.siblings?.length ?? 0) + 1, true)}
            </Typography>
            <Box flexGrow={ 1 } />
          </Stack>
          {initialFormat && (
            <React.Fragment>
              <StyledDivider variant="fullWidth" />
              <ReadingFormatPicker 
                format={ format }
                onChange={ (newFormat) => handleFormatChange(newFormat) } />
            </React.Fragment>
          )}
        </Stack>
        {content && <CardContent>{content}</CardContent>}
      </StyledStack>
    </StyledCard>
  );
}
