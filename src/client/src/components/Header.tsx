import React from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import {
  AppBar,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
  TypographyProps,
  styled as muiStyled,
} from "@mui/material";
import { Icon } from "@mdi/react";
import { mdiApple, mdiSpotify } from "@mdi/js";
import Logo from "@/components/Logo";

type NavigationItemProps = {
  label: string;
  icon?: string;
  items?: NavigationItemProps[];
  onClick?: (options: { navigate?: NavigateFunction }) => void;
};

const NAVIGATION_ITEMS: NavigationItemProps[] = [
  {
    label: "Podcast",
    items: [
      {
        label: "Apple Podcasts",
        icon: mdiApple,
        onClick: () =>
          window.open(
            "https://podcasts.apple.com/us/podcast/chatgptalks/id1671374300",
            "_blank"
          ),
      },
      {
        label: "Spotify",
        icon: mdiSpotify,
        onClick: () =>
          window.open(
            "https://open.spotify.com/episode/0zE70NQAZTF0mc8VKWR8DS?si=r0M8WQrcTFCEJw33XHq_-A",
            "_blank"
          ),
      },
    ],
  },
];

const StyledButton = muiStyled(Button)(({ theme }) => ({
  color: theme.palette.common.white,
}));

const StyledMenu = muiStyled(Menu)(({ theme }) => ({
  "& .MuiPaper-root": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
}));

function NavigationItem({ label, onClick, items }: NavigationItemProps) {
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick ? onClick({ navigate }) : setAnchorEl(event.currentTarget);
    },
    [onClick]
  );

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <StyledButton onClick={handleClick}>{label}</StyledButton>
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
              onClick={() => item.onClick?.({ navigate })}
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

export default function Header() {
  const navigate = useNavigate();
  return (
    <AppBar position="sticky">
      <StyledToolbar>
        <IconButton onClick={() => navigate("/")}>
          <Logo />
        </IconButton>
        <StyledHeaderTitle onClick={() => navigate("/")}>
          ChatGPTalks
        </StyledHeaderTitle>
        {NAVIGATION_ITEMS.map((item) => (
          <NavigationItem key={item.label} {...item} />
        ))}
      </StyledToolbar>
    </AppBar>
  );
}
