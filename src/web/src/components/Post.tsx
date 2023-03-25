import React from 'react';

import {
  mdiChevronLeft,
  mdiDotsHorizontal,
  mdiThumbDownOutline,
  mdiThumbUpOutline,
} from '@mdi/js';
import Icon from '@mdi/react';
import {
  Box,
  Button,
  Card,
  CardMedia,
  Divider,
  Link,
  List,
  Menu,
  MenuItem,
  Stack,
  Theme,
  Typography,
  styled,
  useMediaQuery,
} from '@mui/material';
import { formatDistance } from 'date-fns';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';

import { SessionContext } from '../contexts';

import API, {
  InteractionResponse,
  InteractionType,
  SummaryAttr,
  headers,
} from '@/api';
import ConsumptionModeSelector from '@/components/ConsumptionModeSelector';
import TruncatedText from '@/components/common/TruncatedText';

export const CONSUMPTION_MODES = [
  'bulleted',
  'concise',
  'casual',
  'comprehensive',
] as const;

export type ConsumptionMode = (typeof CONSUMPTION_MODES)[number];

type Props = {
  summary?: SummaryAttr;
  consumptionMode?: ConsumptionMode;
  onChange?: (mode?: ConsumptionMode) => void;
  onInteract?: (resp: InteractionResponse) => void;
};

const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'left',
  minWidth: 200,
  padding: theme.spacing(2),
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

const StyledConsumptionModeContainer = styled(Box)<Props & { mdAndUp: boolean }>(({
  theme, consumptionMode, mdAndUp, 
}) => ({
  borderRadius: 8,
  bottom: consumptionMode && !mdAndUp ? theme.spacing(4) : undefined,
  position: consumptionMode ? 'fixed' : 'relative',
  right: consumptionMode && mdAndUp ? theme.spacing(4) : undefined,
  top: consumptionMode && mdAndUp ? theme.spacing(10) : undefined,
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
  height: 120,
  justifyContent: 'center',
  width: 120,
}));

const StyledStack = styled(Stack)(() => ({ width: '100%' }));

const StyledCategoryStack = styled(Stack)(() => ({
  JustifyContent: 'center',
  alignItems: 'center',
  display: 'flex',
  textAlign: 'center',
}));

const StyledMenuBox = styled(Box)(() => ({ width: 250 }));

export default function Post({
  summary,
  consumptionMode,
  onChange,
  onInteract,
}: Props = {}) {

  const { userData } = React.useContext(SessionContext);

  const mdAndUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
  const lgAndUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));

  const [showMenu, setShowMenu] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const menuRef = React.useRef<HTMLDivElement | null>(null);

  const timeAgo = React.useMemo(
    () =>
      formatDistance(new Date(summary?.createdAt ?? 0), new Date(), { addSuffix: true }),
    [summary?.createdAt]
  );
  
  const likeCount = React.useMemo(
    () => 
      summary?.interactions?.like?.filter((i) => parseInt(i.value ?? '0') > 0).length || 0
    , [summary?.interactions?.like]
  );

  const dislikeCount = React.useMemo(
    () =>
      summary?.interactions?.like?.filter((i) => parseInt(i.value ?? '0') < 0).length || 0
    , [summary?.interactions?.like]
  );

  const interact = React.useCallback(
    async (type: InteractionType, value: string) => {
      if (!summary) {
        return;
      }
      if (!userData) {
        return;
      }
      console.log(userData);
      const { data, error } = await API.interactWithSummary(summary.id ?? '', type, { userId: userData.userId, value }, { headers: headers({ token: userData.tokenString }) });
      if (error) {
        alert(error);
        return;
      }
      if (data) {
        onInteract?.(data);
      }
    },
    [onInteract, summary, userData]
  );

  const cardMediaStack = React.useMemo(() => {
    return (
      <Stack spacing={ 2 }>
        <StyledCategoryBox>
          <StyledCategoryStack>
            <Typography variant="subtitle1">{summary?.category}</Typography>
            <Typography variant="subtitle2">{summary?.subcategory}</Typography>
          </StyledCategoryStack>
        </StyledCategoryBox>
        <Stack>
          <Stack direction="row">
            <Button onClick={ () => interact(InteractionType.Like, '1') }>
              <Icon path={ mdiThumbUpOutline } size={ 1 } />
            </Button>
            <Button onClick={ () => interact(InteractionType.Like, '-1') }>
              <Icon path={ mdiThumbDownOutline } size={ 1 } />
            </Button>
          </Stack>
          {(likeCount > 0 || dislikeCount > 0) && (
            <Stack direction="row">
              <Typography variant="subtitle2">{likeCount}</Typography>
              <Typography variant="subtitle2">{dislikeCount}</Typography>
            </Stack>
          )}
        </Stack>
      </Stack>
    );
  }, [dislikeCount, interact, likeCount, summary?.category, summary?.subcategory]);

  const bottomRowDirection = React.useMemo(() => {
    return lgAndUp ? 'row' : 'column';
  }, [lgAndUp]);

  const content = React.useMemo(() => {
    if (!summary) {
      return null;
    }
    let text = '';
    switch (consumptionMode) {
    case 'bulleted':
      text = summary.bullets.join('\n');
      break;
    case 'concise':
      text = summary.shortSummary;
      break;
    case 'casual':
      text = summary.summary;
      break;
    case 'comprehensive':
      text = summary.abridged;
      break;
    default:
      text = '';
    }
    return (
      <ReactMarkdown>{text}</ReactMarkdown>
    );
  }, [summary, consumptionMode]);
  
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
      <StyledStack spacing={ 2 }>
        <Stack direction="row">
          {consumptionMode !== undefined && (
            <StyledBackButton
              onClick={ () => onChange?.() }
              startIcon={
                <Icon path={ mdiChevronLeft } size={ 2 } /> 
              }>
              Back to Results
            </StyledBackButton>
          )}
          <Stack spacing={ 1 }>
            <Typography variant="subtitle1">{summary?.outletName}</Typography>
            <Typography variant="h6"><TruncatedText maxCharCount={ 120 }>{summary?.title}</TruncatedText></Typography>
          </Stack>
          {!consumptionMode && (
            <StyledCardMedia>
              {cardMediaStack}  
            </StyledCardMedia>
          )}
        </Stack>
        <Divider variant="fullWidth" />
        <Stack direction={ bottomRowDirection } spacing={ 1 }>
          <Typography variant="subtitle2">{timeAgo}</Typography>
          <Box flexGrow={ 1 } />
          <StyledConsumptionModeContainer consumptionMode={ consumptionMode } mdAndUp={ mdAndUp }>
            <ConsumptionModeSelector consumptionMode={ consumptionMode } onChange={ (mode) => onChange?.(mode) } />
          </StyledConsumptionModeContainer>
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
                      View Original Summary
                    </Button>
                  </Link>
                </MenuItem>
              </List>
            </StyledMenuBox>
          </Menu>
        </Stack>
        {consumptionMode !== undefined && <React.Fragment>{content}</React.Fragment>}
      </StyledStack>
    </StyledCard>
  );
}
