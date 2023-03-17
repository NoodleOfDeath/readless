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
  width: 'inherit',
  maxWidth: 1280,
  minHeight: 64,
  padding: theme.spacing(0, 2),
}));

const StyledHeaderTitle = styled(Paper)(({ theme }) => ({
  flexGrow: 1,
  background: 'transparent',
}));

const StyledBox = styled(Box)(({ theme }) => ({ width: 250 }));

export default function Header() {

  const navigate = useNavigate();
  const { userData } = React.useContext(SessionContext);

  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const menuRef = React.useRef<HTMLDivElement>(null);

  const openMenu = React.useCallback(
    (open: boolean) =>
      (
        event:
          | React.KeyboardEvent<HTMLElement>
          | React.MouseEvent<HTMLElement>
          | React.TouchEvent<HTMLElement>,
      ) => {
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
        setOpen(open);
      },
    [menuRef],
  );
  
  const NAVIGATION_ITEMS: NavigationItemProps[] = React.useMemo(() => [
    {
      id: 'Home',
      visible: true,
      label: 'Home',
      icon: mdiHome,
      onClick({ navigate }) {
        navigate?.('/');
      },
    },
    {
      id: 'Login',
      visible: () => !userData?.userId,
      label: 'Login',
      icon: mdiLogin,
      onClick({ navigate }) {
        navigate?.('/login');
      },
    },
    {
      id: 'About',
      visible: () => !userData?.userId,
      label: 'About',
      icon: mdiInformation,
      onClick({ navigate }) {
        navigate?.('/about');
      },
    },
    {
      id: 'Podcast',
      visible: () => !userData?.userId,
      label: 'Podcast',
      icon: mdiPodcast,
      items: PODCAST_LINKS,
    },
    {
      id: 'Profile',
      visible: () => !!userData?.userId,
      label: 'Profile',
      icon: mdiAccount,
      onClick({ navigate }) {
        navigate?.('/profile');
      },
    },
    {
      id: 'Logout',
      visible: () => !!userData?.userId,
      label: 'Logout',
      icon: mdiLogout,
      onClick({ navigate }) {
        navigate?.('/logout');
      },
    },
    {
      id: 'LightDarkModeButtons',
      visible: true,
      content: <LightDarkModeButtons />,
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
            vertical: 'top',
            horizontal: 'right',
          } }
          transformOrigin={ {
            vertical: 'top',
            horizontal: 'right',
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
