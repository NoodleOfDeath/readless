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
  Menu,
  Paper,
  Toolbar,
  Typography,
  styled,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import Logo from '@/components/Logo';
import LightDarkModeButtons from '@/components/layout/header/LightDarkModeButtons';
import NavigationItem, { NavigationItemProps } from '@/components/layout/header/NavigationItem';
import { PODCAST_LINKS } from '@/config/PodcastLinks';
import { SessionContext } from '@/contexts';

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

const StyledBox = styled(Box)(() => ({ width: 250 }));

export default function Header() {

  const navigate = useNavigate();
  const { userData } = React.useContext(SessionContext);

  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const menuRef = React.useRef<HTMLDivElement>(null);

  const openMenu = React.useCallback(
    (open: boolean) =>
      (event:
          | React.KeyboardEvent<HTMLElement>
          | React.MouseEvent<HTMLElement>
          | React.TouchEvent<HTMLElement>) => {
        if (!event) {
          setAnchorEl(null);
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
        setAnchorEl(open ? event?.currentTarget : null);
        setOpen(open);
      },
    [menuRef]
  );
  
  const NAVIGATION_ITEMS: NavigationItemProps[] = React.useMemo(() => [
    {
      icon: mdiHome,
      id: 'Home',
      label: 'Home',
      onClick({ navigate }) {
        navigate?.('/');
      },
      visible: true,
    },
    {
      icon: mdiLogin,
      id: 'Login',
      label: 'Login',
      onClick({ navigate }) {
        navigate?.('/login');
      },
      visible: () => !userData?.isLoggedIn,
    },
    {
      icon: mdiInformation,
      id: 'About',
      label: 'About',
      onClick({ navigate }) {
        navigate?.('/about');
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
      onClick({ navigate }) {
        navigate?.('/profile');
      },
      visible: () => !!userData?.isLoggedIn,
    },
    {
      icon: mdiLogout,
      id: 'Logout',
      label: 'Logout',
      onClick({ navigate }) {
        navigate?.('/logout');
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
        <IconButton onClick={ () => navigate('/') }>
          <Logo />
        </IconButton>
        <StyledHeaderTitle elevation={ 0 }>
          <Typography onClick={ () => navigate('/') } component="h4">
            theSkoop
          </Typography>
        </StyledHeaderTitle>
        <Button onClick={ openMenu(true) }>
          <Icon path={ mdiMenu } size={ 1 } />
        </Button>
        <Menu
          open={ open }
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
          <StyledBox
            role="presentation"
            onClick={ openMenu(false) }
            onKeyDown={ openMenu(false) }
            onTouchMove={ openMenu(false) }
            ref={ menuRef }>
            <List>
              {NAVIGATION_ITEMS.filter((item) => item.visible instanceof Function ? item.visible() : item.visible).map((item, i) => (
                <React.Fragment key={ item.id }>
                  <NavigationItem { ...item } />
                  {i < NAVIGATION_ITEMS.length - 1 && (
                    <Divider orientation="horizontal" />
                  )}
                </React.Fragment>
              ))}
            </List>
          </StyledBox>
        </Menu>
      </StyledToolbar>
    </AppBar>
  );
}
