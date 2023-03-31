import React from 'react';

import {
  mdiChevronLeft,
  mdiDotsHorizontal,
  mdiThumbDown,
  mdiThumbDownOutline,
  mdiThumbUp,
  mdiThumbUpOutline,
} from '@mdi/js';
import Icon from '@mdi/react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Link,
  List,
  Menu,
  MenuItem,
  Stack,
  Typography,
  styled,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { formatDistance } from 'date-fns';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';

import {
  InteractionType,
  InteractionUserVote,
  SummaryResponse,
} from '@/api';
import ServingSizeSelector from '@/components/ServingSizeSelector';
import TruncatedText from '@/components/common/TruncatedText';

export const SERVING_SIZES = [
  'bullets',
  'concise',
  'casual',
  'detailed',
] as const;

export type ServingSize = (typeof SERVING_SIZES)[number];

type Props = {
  summary?: SummaryResponse;
  servingSize?: ServingSize;
  onChange?: (mode?: ServingSize) => void;
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

const StyledBackButton = styled(Button)(({ theme }) => ({
  background: theme.palette.primary.main,
  border: theme.palette.secondary.main,
  borderRadius: 20,
  color: theme.palette.primary.contrastText,
  height: 40,
  left: theme.spacing(2),
  opacity: 0.8,
  paddingRight: theme.spacing(5),
  position: 'fixed',
  top: theme.spacing(10),
}));

const StyledServingSizeContainer = styled(Box)<Partial<Props>>(({ theme, servingSize }) => ({
  borderRadius: 8,
  bottom: servingSize && theme.breakpoints.down('md') ? theme.spacing(4) : undefined,
  left: servingSize && theme.breakpoints.down('md') ? '50%' : undefined,
  position: servingSize ? 'fixed' : 'relative',
  right: servingSize && !theme.breakpoints.down('md') ? theme.spacing(4) : undefined,
  top: servingSize && !theme.breakpoints.down('md') ? theme.spacing(10) : undefined,
}));

const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
  borderRadius: 8,
  marginLeft: theme.spacing(2),
  width: 120,
}));

const StyledCategoryBox = styled(Box)(({ theme }) => ({
  alignItems: 'center',
  background: theme.palette.primary.main,
  borderRadius: 8,
  color: theme.palette.primary.contrastText,
  display: 'flex',
  height: 150,
  justifyContent: 'center', 
  width: 120,
}));

const StyledDivider = styled(Divider)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  marginTop: theme.spacing(2),
}));

const StyledStack = styled(Stack)(() => ({ width: '100%' }));

const StyledPaddedStack = styled(Stack)(({ theme }) => ({ padding: theme.spacing(2) }));

const StyledCenteredStack = styled(Stack)(() => ({
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'center',
  textAlign: 'center',
}));

const StyledMenuBox = styled(Box)(() => ({ width: 250 }));

export default function Summary({
  summary,
  servingSize,
  onChange,
  onInteract,
}: Props = {}) {

  const theme = useTheme();
  
  const mdAndDown = useMediaQuery(theme.breakpoints.down('md'));

  const bottomRowDirection = React.useMemo(() => {
    return mdAndDown ? 'column' : 'row';
  }, [mdAndDown]);

  const [showMenu, setShowMenu] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [showSplitVotes, setShowSplitVotes] = React.useState(false);

  const menuRef = React.useRef<HTMLDivElement | null>(null);

  const timeAgo = React.useMemo(
    () =>
      formatDistance(new Date(summary?.createdAt ?? 0), new Date(), { addSuffix: true }),
    [summary?.createdAt]
  );
  
  const upvotes = React.useMemo(
    () => 
      summary?.interactions?.upvote ?? 0
    , [summary?.interactions?.upvote]
  );

  const downvotes = React.useMemo(
    () =>
      summary?.interactions?.downvote ?? 0
    , [summary?.interactions?.downvote]
  );
  
  const votes = React.useMemo(() => upvotes - downvotes, [downvotes, upvotes]);

  const cardMediaStack = React.useMemo(() => {
    return (
      <StyledCenteredStack direction='column' spacing={ 2 }>
        <StyledCategoryBox>
          <StyledCenteredStack>
            <Typography variant="subtitle1">{summary?.category}</Typography>
            <Typography variant="subtitle2">{summary?.subcategory}</Typography>
          </StyledCenteredStack>
        </StyledCategoryBox>
      </StyledCenteredStack>
    );
  }, [summary?.category, summary?.subcategory]);
  
  const interactionButtons = React.useMemo(() => {
    return (
      <Stack direction="row" spacing={ 1 }>
        <Button onClick={ () => onInteract?.(InteractionType.Upvote) }>
          <Icon path={ summary?.interactions.uservote === InteractionUserVote.Up ? mdiThumbUp : mdiThumbUpOutline } size={ 1 } />
        </Button>
        <StyledCenteredStack onClick={ () => setShowSplitVotes(!showSplitVotes) }>
          {showSplitVotes ? (
            <React.Fragment>
              <Typography variant="subtitle2">{upvotes}</Typography>
              <Typography variant="subtitle2">
                -
                {downvotes}
              </Typography>
            </React.Fragment>
          ) : (
            <Typography variant="subtitle1">{votes}</Typography>
          )}
        </StyledCenteredStack>
        <Button onClick={ () => onInteract?.(InteractionType.Downvote) }>
          <Icon path={ summary?.interactions.uservote === InteractionUserVote.Down ? mdiThumbDown : mdiThumbDownOutline } size={ 1 } />
        </Button>
      </Stack>
    );
  }, [downvotes, onInteract, upvotes, showSplitVotes, votes, summary?.interactions.uservote]);

  const content = React.useMemo(() => {
    if (!summary) {
      return null;
    }
    let text = '';
    switch (servingSize) {
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
      text = '';
    }
    return (
      <ReactMarkdown>{text}</ReactMarkdown>
    );
  }, [summary, servingSize]);
  
  const openMenu = React.useCallback(
    (open: boolean) =>
      (event:
          | React.KeyboardEvent<HTMLElement>
          | React.MouseEvent<HTMLElement>
          | React.TouchEvent<HTMLElement>) => {
        if (!event) {
          setAnchorEl(null);
          setShowMenu(false);
          return;
        }
        if (
          event.type === 'keydown' &&
          ((event as React.KeyboardEvent).key === 'Tab' ||
            (event as React.KeyboardEvent).key === 'Shift')
        ) {
          return;
        } else if (event.type === 'click') {
          if (
            menuRef.current &&
            menuRef.current.contains(event.currentTarget)
          ) {
            return;
          }
          event.stopPropagation();
        } else if (event.type === 'touchmove') {
          if (
            menuRef.current &&
            menuRef.current.contains(event.currentTarget)
          ) {
            return;
          }
          event.stopPropagation();
        }
        setAnchorEl(open ? event?.currentTarget : null);
        setShowMenu(open);
      },
    [menuRef]
  );

  return (
    <StyledCard>
      {servingSize !== undefined && (
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
          <StyledPaddedStack flexGrow={ 1 }>
            <Typography variant="subtitle1">{summary?.outletName}</Typography>
            <Typography variant="h6">
              <TruncatedText maxCharCount={ 200 }>{summary?.title}</TruncatedText>
            </Typography>
          </StyledPaddedStack>
          <StyledCardMedia>
            {cardMediaStack}  
          </StyledCardMedia>
        </StyledStack>
        <StyledDivider variant="fullWidth" />
        <Stack direction={ bottomRowDirection } spacing={ 1 }>
          <Stack direction='row' sx={ { lineHeight: '4rem' } }>
            <Typography variant="subtitle2">{timeAgo}</Typography>
            <Box flexGrow={ 1 } />
            {interactionButtons}
          </Stack>
          <Box flexGrow={ 1 } />
          <StyledServingSizeContainer servingSize={ servingSize }>
            <ServingSizeSelector servingSize={ servingSize } onChange={ (size) => onChange?.(size) } />
          </StyledServingSizeContainer>
          <Button onClick={ openMenu(true) }>
            <Icon path={ mdiDotsHorizontal } size={ 1 } />
          </Button>
          <Menu
            open={ showMenu }
            anchorEl={ anchorEl }
            onClose={ openMenu(false) }
            anchorOrigin={ {
              horizontal: 'right',
              vertical: 'top',
            } }
            transformOrigin={ {
              horizontal: 'right',
              vertical: 'top',
            } }>
            <StyledMenuBox
              role="presentation"
              onClick={ openMenu(false) }
              onKeyDown={ openMenu(false) }
              onTouchMove={ openMenu(false) }
              ref={ menuRef }>
              <List>
                <MenuItem>
                  <Link
                    variant="caption"
                    href={ summary?.url }
                    target="_blank"
                    color="inherit">
                    <Button>
                      View Original Source
                    </Button>
                  </Link>
                </MenuItem>
              </List>
            </StyledMenuBox>
          </Menu>
        </Stack>
        {servingSize !== undefined && <CardContent>{content}</CardContent>}
      </StyledStack>
    </StyledCard>
  );
}
