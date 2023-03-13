import React from "react";
import { useNavigate } from "react-router-dom";
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
} from "@mui/material";
import { Icon } from "@mdi/react";
import { mdiHome, mdiInformation, mdiLogin, mdiMenu, mdiPodcast } from "@mdi/js";

import Logo from "@/components/Logo";
import LightDarkModeButtons from "@/components/layout/header/LightDarkModeButtons";
import { PODCAST_LINKS } from "@/config/PodcastLinks";
import NavigationItem, {
  NavigationItemProps,
} from "@/components/layout/header/NavigationItem";

const NAVIGATION_ITEMS: NavigationItemProps[] = [
  {
    id: "Home",
    label: "Home",
    icon: mdiHome,
    onClick({ navigate }) {
      navigate?.("/");
    },
  },
  {
    id: "Login",
    label: "Login",
    icon: mdiLogin,
    onClick({ navigate }) {
      navigate?.("/login");
    },
  },
  {
    id: "About",
    label: "About",
    icon: mdiInformation,
    onClick({ navigate }) {
      navigate?.("/about");
    },
  },
  {
    id: "Podcast",
    label: "Podcast",
    icon: mdiPodcast,
    items: PODCAST_LINKS,
  },
  {
    id: "LightDarkModeButtons",
    content: <LightDarkModeButtons />,
  },
];

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  margin: "auto",
  width: "inherit",
  maxWidth: 1280,
  minHeight: 64,
  padding: theme.spacing(0, 2),
}));

const StyledHeaderTitle = styled(Paper)(({ theme }) => ({
  flexGrow: 1,
  background: "transparent",
}));

const StyledBox = styled(Box)(({ theme }) => ({
  width: 250,
}));

export default function Header() {
  const navigate = useNavigate();

  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const menuRef = React.useRef<HTMLDivElement>(null);

  const openMenu = React.useCallback(
    (open: boolean) =>
      (
        event:
          | React.KeyboardEvent<HTMLElement>
          | React.MouseEvent<HTMLElement>
          | React.TouchEvent<HTMLElement>
      ) => {
        if (!event) {
          setAnchorEl(null);
          setOpen(false);
          return;
        }
        if (
          event.type === "keydown" &&
          ((event as React.KeyboardEvent).key === "Tab" ||
            (event as React.KeyboardEvent).key === "Shift")
        ) {
          return;
        } else if (event.type === "click") {
          if (
            menuRef.current &&
            menuRef.current.contains(event.currentTarget)
          ) {
            return;
          }
          event.stopPropagation();
        } else if (event.type === "touchmove") {
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

  return (
    <AppBar position="sticky">
      <StyledToolbar>
        <IconButton onClick={() => navigate("/")}>
          <Logo />
        </IconButton>
        <StyledHeaderTitle elevation={0}>
          <Typography onClick={() => navigate("/")} component="h4">
            theSkoop
          </Typography>
        </StyledHeaderTitle>
        <Button onClick={openMenu(true)}>
          <Icon path={mdiMenu} size={1} />
        </Button>
        <Menu
          open={open}
          anchorEl={anchorEl}
          onClose={openMenu(false)}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <StyledBox
            role="presentation"
            onClick={openMenu(false)}
            onKeyDown={openMenu(false)}
            onTouchMove={openMenu(false)}
            ref={menuRef}
          >
            <List>
              {NAVIGATION_ITEMS.map((item, i) => (
                <React.Fragment key={item.id}>
                  <NavigationItem {...item} />
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
