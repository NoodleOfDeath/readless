import React from 'react';

import {
  mdiClose,
  mdiHome,
  mdiMenu,
} from '@mdi/js';
import { Icon } from '@mdi/react';
import {
  AppBar,
  Box,
  Button,
  Card,
  CardMedia,
  Divider,
  IconButton,
  List,
  Paper,
  Stack,
  SwipeableDrawer,
  Toolbar,
  Typography,
  styled,
} from '@mui/material';

import Logo from '~/components/Logo';
import Footer from '~/components/layout/Footer';
import LightDarkModeButtons from '~/components/layout/header/LightDarkModeButtons';
import NavigationItem, { NavigationItemProps } from '~/components/layout/header/NavigationItem';
import { useRouter } from '~/hooks';

const StyledDownloadBanner = styled(Card)(({ theme }) => ({
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'center',
  padding: theme.spacing(2),
}));

const StyledStack = styled(Stack)(() => ({ alignItems: 'center' }));

const StyledCardMedia = styled(CardMedia)(() => ({
  borderRadius: '22%',
  height: 40,
  overflow: 'hidden',
  width: 40,
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  margin: 'auto',
  maxWidth: 1280,
  minHeight: 64,
  padding: theme.spacing(0, 2),
  width: 'inherit',
}));

const StyledHeaderTitle = styled(Paper)(() => ({
  background: 'transparent',
  flexGrow: 1,
}));

const StyledBox = styled(Box)(() => ({
  margin: 'auto', maxWidth: 1280, width : '100%', 
})); 

export default function Header() {

  const router = useRouter();

  const [downloadMobileApp, setDownloadMobileApp] = React.useState('');
  const [open, setOpen] = React.useState(false);

  const menuRef = React.useRef<HTMLDivElement>(null);

  const openMenu = React.useCallback(
    (open: boolean) =>
      (event:
          | React.KeyboardEvent<HTMLElement>
          | React.MouseEvent<HTMLElement>
          | React.TouchEvent<HTMLElement>) => {
        if (!event) {
          setOpen(false);
          return;
        }
        if (
          event.type === 'keydown' &&
          ((event as React.KeyboardEvent).key === 'Tab' ||
            (event as React.KeyboardEvent).key === 'Shift')
        ) {
          return;
        } else if (event.type === 'click' || event.type === 'touchmove') {
          if (
            menuRef.current &&
            menuRef.current.contains(event.currentTarget)
          ) {
            return;
          }
          event.stopPropagation();
        }
        setOpen(open);
      },
    [menuRef]
  );
  
  const NAVIGATION_ITEMS: NavigationItemProps[] = React.useMemo(() => [
    {
      icon: mdiHome,
      id: 'Home',
      label: 'Home',
      onClick() {
        router?.push('/');
      },
      visible: true,
    },
    {
      content: <LightDarkModeButtons />,
      id: 'LightDarkModeButtons',
      visible: true,
    },
  ], [router]);

  React.useEffect(() => {
    const isIos = [
      'iPad Simulator',
      'iPhone Simulator',
      'iPod Simulator',
      'iPad',
      'iPhone',
      'iPod',
    ].includes(navigator.platform)
    // iPad on iOS 13 detection
    || (navigator.userAgent.includes('Mac') && 'ontouchend' in document);
    const isAndroid = (navigator.userAgent.match(/Android/i)
         || navigator.userAgent.match(/webOS/i)
         || navigator.userAgent.match(/iPhone/i)
         || navigator.userAgent.match(/iPad/i)
         || navigator.userAgent.match(/iPod/i)
         || navigator.userAgent.match(/BlackBerry/i)
         || navigator.userAgent.match(/Windows Phone/i));
    if (isIos) {
      setDownloadMobileApp('ios');
    } else if (isAndroid) {
      setDownloadMobileApp('android');
    }
  }, []);

  return (
    <React.Fragment>
      {downloadMobileApp && (
        <StyledDownloadBanner>
          <StyledStack direction="row" spacing={ 2 }>
            <StyledCardMedia
              onClick={ () => window.open(`/${downloadMobileApp}`, '_blank') }
              image="/AppIcon.png" />
            <Typography variant="caption">
              Read anywhere and offline in the app
            </Typography>
            <Button
              variant='outlined'
              onClick={ () => window.open(`/${downloadMobileApp}`, '_blank') }>
              <Typography variant="caption">Read In App</Typography>
            </Button>
          </StyledStack>
        </StyledDownloadBanner>
      )}
      <AppBar position="sticky">
        <StyledToolbar>
          <StyledHeaderTitle elevation={ 0 }>
            <IconButton onClick={ () => router.push('/') }>
              <Logo variant='compact' />
            </IconButton>
          </StyledHeaderTitle>
          <IconButton onClick={ () => setOpen(true) }>
            <Icon path={ mdiMenu } size={ 1 } />
          </IconButton>
          <SwipeableDrawer
            anchor="top"
            open={ open }
            onOpen={ openMenu(true) }
            onClose={ openMenu(false) }>
            <StyledBox
              role="presentation"
              onClick={ openMenu(false) }
              onKeyDown={ openMenu(false) }
              onTouchMove={ openMenu(false) }
              ref={ menuRef }>
              <IconButton onClick={ () => setOpen(false) }>
                <Icon path={ mdiClose } size={ 1 } />
              </IconButton>
              <List>
                {NAVIGATION_ITEMS.filter((item) => item.visible instanceof Function ? item.visible() : item.visible === true).map((item, i) => (
                  <React.Fragment key={ item.id }>
                    <NavigationItem
                      { ...item }
                      onClick={ () => {
                        setOpen(false); item.onClick?.();
                      } } />
                    {i < NAVIGATION_ITEMS.length - 1 && (
                      <Divider orientation="horizontal" />
                    )}
                  </React.Fragment>
                ))}
              </List>
              <Footer />
            </StyledBox>
          </SwipeableDrawer>
        </StyledToolbar>
      </AppBar>
    </React.Fragment>
  );
}
