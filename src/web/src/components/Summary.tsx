import React from 'react';

import {
  mdiCircle,
  mdiEmail,
  mdiFacebook,
  mdiFacebookMessenger,
  mdiLinkedin,
  mdiTwitter,
  mdiWhatsapp,
} from '@mdi/js';
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
import { format as formatDate, formatDistance } from 'date-fns';
import ms from 'ms';
import pluralize from 'pluralize';
import { useMediaQuery } from 'react-responsive';
import {
  EmailShareButton,
  FacebookMessengerShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from 'react-share';

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
  shareableLink,
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

const FullWidth = styled(Box)(() => ({ width: '100%' }));

export default function Summary({
  big,
  summary,
  initialFormat,
  tickIntervalMs = ms('5m'),
  onChange,
}: Props) {

  const { handleInteraction } = useSummaryClient();
  const { preferredReadingFormat } = React.useContext(SessionContext);

  const mdAndDown = useMediaQuery({ maxWidth: 960 });
  const smAndDown = useMediaQuery({ maxWidth: 600 });
  const xsAndDown = useMediaQuery({ maxWidth: 400 });

  const [format, setFormat] = React.useState(initialFormat);
  const [lastTick, setLastTick] = React.useState(new Date());

  const timeAgo = React.useMemo(() => {
    const timestamp = summary.originalDate && Date.now() - new Date(summary.originalDate).valueOf() < ms('10y') ? summary.originalDate : summary.createdAt;
    if (!timestamp) {
      return null;
    }
    const date = new Date(timestamp);
    return Date.now() - date.valueOf() > ms('1w') ? formatDate(date, 'EEE PP') : formatDistance(date, lastTick, { addSuffix: true });
  }, [summary.originalDate, summary.createdAt, lastTick]);

  const shareUrl = React.useMemo(() => shareableLink(summary, process.env.NEXT_PUBLIC_BASE_URL as string, format), [format, summary]);

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
    <StyledCard 
      onClick={ initialFormat ? undefined : () => handleFormatChange(preferredReadingFormat ?? ReadingFormat.Bullets) }>
      <FullWidth component={ initialFormat ? 'article' : undefined }>
        <Stack spacing={ 2 }>
          {big && imageUrl && (
            <Box component={ initialFormat ? 'figure' : undefined }>
              <div style={ {
                backgroundImage: `url(${imageUrl})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                borderRadius: 12, 
                height: 400, 
                maxHeight: '40vh',
                width: '100%', 
              } } />
            </Box>
          )}
          <Box component={ initialFormat ? 'address' : undefined }>
            <Stack 
              direction={ xsAndDown ? 'column' : 'row' }
              spacing={ 1 }
              flexGrow={ 1 }
              alignItems={ 'center' }>
              <Stack direction={ smAndDown ? 'column' : 'row' } spacing={ smAndDown ? 0 : 1 } alignItems="center">
                <Stack direction="row" spacing={ 1 } alignItems="center">
                  <img 
                    src={ publisherIcon(summary.publisher) }
                    alt={ summary.publisher.displayName }
                    width={ 24 }
                    height={ 24 }
                    style={ { borderRadius: '50%' } } />
                  <Typography variant="subtitle2">{summary.publisher.displayName}</Typography>
                </Stack>
                {!smAndDown && <Typography variant="subtitle2">·</Typography>}
                <Typography variant="subtitle2">
                  <time dateTime={ summary.originalDate }>{timeAgo}</time>
                </Typography>
              </Stack>
              <Box flexGrow={ 1 } />
              <Typography variant="subtitle2">
                {fixedSentiment(summary.sentiment)}
              </Typography>
              <MeterDial value={ summary.sentiment } width={ 40 } />
            </Stack>
          </Box>
          <Stack direction={ smAndDown ? 'column' : 'row' } spacing={ 2 } alignItems={ 'center' }>
            <Stack spacing={ 1 } flexGrow={ 1 }>
              <StyledTitle variant="subtitle1">
                {summary.title}
              </StyledTitle>
              {initialFormat && (
                <Typography variant="body1" textAlign={ 'right' }>
                  ...so here&apos;s what happened in a nutshell
                </Typography>
              )}
              {(!smAndDown || initialFormat) && <Typography variant="body2">{summary.shortSummary}</Typography>}
              <Box flexGrow={ 1 } />
            </Stack>
            {!big && imageUrl && (
              <Box component={ initialFormat ? 'figure' : undefined }>
                <div style={ {
                  backgroundImage: `url(${imageUrl})`,
                  backgroundPosition: 'center',
                  backgroundSize: 'cover',
                  borderRadius: 12, 
                  height: '100%',
                  minHeight: 100,
                  width: 100, 
                } } />
              </Box>
            )}
          </Stack>
          <Stack direction='column' spacing={ 2 }>
            <Stack direction={ mdAndDown ? 'column' : 'row' } flexGrow={ 1 } alignItems="center" spacing={ 1 }>
              <Stack direction="row" spacing={ 1 }>
                <Typography variant="subtitle2">{summary.category.displayName}</Typography>
                <Typography variant="subtitle2">·</Typography>
                <Typography variant="subtitle2">
                  {pluralize('Article', (summary.siblings?.length ?? 0) + 1, true)}
                </Typography>
              </Stack>
              <Box flexGrow={ 1 } />
              <Stack direction="row" spacing={ 1 }>
                <EmailShareButton url={ shareUrl }>
                  <Icon path={ mdiEmail } size={ 1 } />
                </EmailShareButton>
                <FacebookShareButton url={ shareUrl }>
                  <Icon path={ mdiFacebook } size={ 1 } />
                </FacebookShareButton>
                <FacebookMessengerShareButton appId={ process.env.NEXT_PUBLIC_FACEBOOK_ID as string } url={ shareUrl }>
                  <Icon path={ mdiFacebookMessenger } size={ 1 } />
                </FacebookMessengerShareButton>
                <TwitterShareButton url={ shareUrl }>
                  <Icon path={ mdiTwitter } size={ 1 } />
                </TwitterShareButton>
                <LinkedinShareButton url={ shareUrl }>
                  <Icon path={ mdiLinkedin } size={ 1 } />
                </LinkedinShareButton>
                <TelegramShareButton url={ shareUrl }>
                  <TelegramIcon size={ 30 } iconFillColor={ 'black' } bgStyle={ { fill: 'none' } } />
                </TelegramShareButton>
                <WhatsappShareButton url={ shareUrl }>
                  <Icon path={ mdiWhatsapp } size={ 1 } />
                </WhatsappShareButton>
              </Stack>
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
        </Stack>
      </FullWidth>
    </StyledCard>
  );
}
