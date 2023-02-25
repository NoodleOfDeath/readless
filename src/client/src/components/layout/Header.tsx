import React from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
  TypographyProps,
  styled as muiStyled,
  Divider,
} from "@mui/material";
import { Icon } from "@mdi/react";
import Logo from "@/components/Logo";
import { PODCAST_LINKS } from "@/config/PodcastLinks";
import { mdiHome, mdiInformation, mdiMenu, mdiPodcast } from "@mdi/js";

type NavigationItemProps = {
  label: string;
  icon?: string;
  items?: NavigationItemProps[];
  onClick?: (options: {
    navigate?: NavigateFunction;
    handleClose: () => void;
  }) => void;
};

const NAVIGATION_ITEMS: NavigationItemProps[] = [
  {
    label: "Home",
    icon: mdiHome,
    onClick({ navigate, handleClose }) {
      navigate?.("/");
      handleClose();
    },
  },
  {
    label: "About",
    icon: mdiInformation,
    onClick({ navigate, handleClose }) {
      navigate?.("/about");
      handleClose();
    },
  },
  {
    label: "Podcast",
    icon: mdiPodcast,
    items: PODCAST_LINKS,
  },
];

const StyledMenuButton = muiStyled(Button)(({ theme }) => ({
  color: theme.palette.common.white,
}));

const StyledMenuItemButton = muiStyled(StyledMenuButton)(({ theme }) => ({
  width: "100%",
  padding: theme.spacing(1, 2),
  justifyContent: "flex-start",
}));

const StyledMenu = muiStyled(Menu)(({ theme }) => ({
  "& .MuiPaper-root": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
}));

function NavigationItem({ label, icon, items, onClick }: NavigationItemProps) {
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClose = React.useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick
        ? onClick({ navigate, handleClose })
        : setAnchorEl(event.currentTarget);
    },
    [onClick]
  );

  return (
    <>
      <StyledMenuItemButton
        onClick={handleClick}
        startIcon={icon && <Icon path={icon} size={1} />}
      >
        {label}
      </StyledMenuItemButton>
      {items && (
        <StyledMenu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
        >
          {items.map((item) => (
            <MenuItem
              key={item.label}
              onClick={() => item.onClick?.({ navigate, handleClose })}
            >
              <Stack direction="row" alignContent="center" spacing={2}>
                {item.icon && (
                  <div>
                    <Icon path={item.icon} size={1} color="white" />
                  </div>
                )}
                <div>{item.label}</div>
              </Stack>
            </MenuItem>
          ))}
        </StyledMenu>
      )}
    </>
  );
}

const StyledToolbar = muiStyled(Toolbar)(({ theme }) => ({
  margin: "auto",
  width: "inherit",
  maxWidth: 1280,
  minHeight: 64,
  padding: theme.spacing(0, 2),
}));

const StyledHeaderTitle = muiStyled(
  <D extends React.ElementType<any> = "div">(props: TypographyProps<D>) => (
    <Typography {...props} variant="h5" />
  )
)(({ theme }) => ({
  marginLeft: theme.spacing(2),
  flexGrow: 1,
}));

const StyledDrawer = muiStyled(Drawer)(({ theme }) => ({
  "& .MuiDrawer-paper": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
}));

const StyledBox = muiStyled(Box)(({ theme }) => ({
  width: 250,
}));

export default function Header() {
  const navigate = useNavigate();

  const [open, setOpen] = React.useState(false);
  const drawerRef = React.useRef<HTMLDivElement>(null);

  const toggleDrawer = React.useCallback(
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      } else if (event && event.type === "click") {
        if (
          drawerRef.current &&
          drawerRef.current.contains(event.target as HTMLElement)
        ) {
          return;
        }
        event.stopPropagation();
      }
      setOpen(open);
    },
    [drawerRef]
  );

  return (
    <AppBar position="sticky">
      <StyledToolbar>
        <IconButton onClick={() => navigate("/")}>
          <Logo />
        </IconButton>
        <StyledHeaderTitle onClick={() => navigate("/")}>
          TheSkoop
        </StyledHeaderTitle>
        <StyledMenuButton onClick={toggleDrawer(true)}>
          <Icon path={mdiMenu} size={1} />
        </StyledMenuButton>
        <StyledDrawer anchor="right" open={open} onClose={toggleDrawer(false)}>
          <StyledBox
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
            ref={drawerRef}
          >
            <List>
              {NAVIGATION_ITEMS.map((item, i) => (
                <React.Fragment key={item.label}>
                  <NavigationItem {...item} />
                  {i < NAVIGATION_ITEMS.length - 1 && (
                    <Divider color="white" orientation="horizontal" />
                  )}
                </React.Fragment>
              ))}
            </List>
          </StyledBox>
        </StyledDrawer>
      </StyledToolbar>
    </AppBar>
  );
}
