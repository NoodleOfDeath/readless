import { Button, Menu, MenuItem, styled } from "@mui/material";
import { Icon } from "@mdi/react";
import React from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";

export type NavigationItemProps = {
  id: string;
  label?: string;
  icon?: string;
  content?: React.ReactNode;
  items?: NavigationItemProps[];
  onClick?: (options: { navigate?: NavigateFunction }) => void;
};

const StyledMenuItemButton = styled(Button)(({ theme }) => ({
  width: "100%",
  padding: theme.spacing(1, 2),
  justifyContent: "flex-start",
}));

export default function NavigationItem({
  label,
  icon,
  content,
  items,
  onClick,
}: NavigationItemProps) {
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handleClose = React.useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick ? onClick({ navigate }) : setAnchorEl(event.currentTarget);
    },
    [navigate, onClick]
  );

  return (
    <MenuItem>
      {(onClick || (items && items.length > 0)) && (
        <StyledMenuItemButton
          onClick={handleClick}
          startIcon={icon && <Icon path={icon} size={1} />}
        >
          {label}
        </StyledMenuItemButton>
      )}
      {content && <>{content}</>}
      {items && items.length > 0 && (
        <Menu
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
            <MenuItem key={item.id}>
              <StyledMenuItemButton
                onClick={() => item.onClick?.({ navigate })}
                startIcon={item.icon && <Icon path={item.icon} size={1} />}
              >
                {item.label}
              </StyledMenuItemButton>
            </MenuItem>
          ))}
        </Menu>
      )}
    </MenuItem>
  );
}
