import React from 'react';

import {
  mdiAccount,
  mdiHome,
  mdiInformation,
  mdiLogin,
  mdiLogout,
  mdiMenu,
  mdiPodcast,
} from '@mdi/js';
import { Icon } from '@mdi/react';
import {
  AppBar,
  Box,
  Button,
  Divider,
  IconButton,
  List,
  Paper,
  SwipeableDrawer,
  Toolbar,
  styled,
} from '@mui/material';

import LoginDialog from '../../login/LoginDialog';

import Logo from '@/components/Logo';
import Footer from '@/components/layout/Footer';
import LightDarkModeButtons from '@/components/layout/header/LightDarkModeButtons';
import NavigationItem, { NavigationItemProps } from '@/components/layout/header/NavigationItem';
import { PODCAST_LINKS } from '@/config/PodcastLinks';
import { SessionContext } from '@/contexts';
import { useRouter } from '@/next/router';

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
  const { userData } = React.useContext(SessionContext);

  const [open, setOpen] = React.useState(false);

  const menuRef = React.useRef<HTMLDivElement>(null);
  const [showLoginDialog, setShowLoginDialog] = React.useState(false);

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
      onClick({ router }) {
        router?.push('/');
      },
      visible: true,
    },
    {
      icon: mdiLogin,
      id: 'Login',
      label: 'Login',
      onClick() {
        setShowLoginDialog(true);
      },
      visible: () => !userData?.isLoggedIn,
    },
    {
      icon: mdiInformation,
      id: 'About',
      label: 'About',
      onClick({ router }) {
        router?.push('/about');
      },
      visible: () => !userData?.isLoggedIn,
    },
    {
      icon: mdiPodcast,
      id: 'Podcast',
      items: PODCAST_LINKS,
      label: 'Podcast',
      visible: () => !userData?.isLoggedIn,
    },
    {
      icon: mdiAccount,
      id: 'Profile',
      label: 'Profile',
      onClick({ router }) {
        router?.push('/profile');
      },
      visible: () => !!userData?.isLoggedIn,
    },
    {
      icon: mdiLogout,
      id: 'Logout',
      label: 'Logout',
      onClick({ router }) {
        router?.push('/logout');
      },
      visible: () => !!userData?.isLoggedIn,
    },
    {
      content: <LightDarkModeButtons />,
      id: 'LightDarkModeButtons',
      visible: true,
    },
  ], [userData]);

  return (
    <AppBar position="sticky">
      <StyledToolbar>
        <StyledHeaderTitle elevation={ 0 }>
          <IconButton onClick={ () => router.push('/') }>
            <Logo variant='compact' />
          </IconButton>
        </StyledHeaderTitle>
        <Button onClick={ openMenu(true) }>
          <Icon path={ mdiMenu } size={ 1 } />
        </Button>
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
            <List>
              {NAVIGATION_ITEMS.filter((item) => item.visible instanceof Function ? item.visible() : item.visible === true).map((item, i) => (
                <React.Fragment key={ item.id }>
                  <NavigationItem { ...item } />
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
      <LoginDialog open={ showLoginDialog } onClose={ () => setShowLoginDialog(false) } onSuccessfulLogin={ () => setShowLoginDialog(false) } />
    </AppBar>
  );
}
