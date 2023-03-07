import React from "react";
import { formatDistance } from "date-fns";
import {
  Box,
  Card,
  CardMedia,
  Link,
  List,
  Stack,
  Typography,
  styled,
  Divider,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";

import { SourceAttr, SourceAttributes } from "@/api/Api";
import Icon from "@mdi/react";
import { mdiDotsHorizontal } from "@mdi/js";

export const CONSUMPTION_MODES = [
  // "bulleted",
  "concise",
  "casual",
  "comprehensive",
] as const;

export type ConsumptionMode = (typeof CONSUMPTION_MODES)[number];

type Props = {
  source?: SourceAttr | SourceAttributes;
  consumptionMode?: ConsumptionMode;
};

const StyledCard = styled(Card)(({ theme }) => ({
  minWidth: 200,
  display: "flex",
  padding: theme.spacing(2),
  justifyContent: "left",
  textAlign: "left",
}));

const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
  width: 120,
  height: 120,
  marginLeft: theme.spacing(2),
  borderRadius: 8,
}));

const StyledBox = styled(Box)(({ theme }) => ({
  width: 250,
}));

export default function Post({
  source,
  consumptionMode = "concise",
  ...rest
}: Props = {}) {

  const [showMenu, setShowMenu] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const menuRef = React.useRef<HTMLDivElement|null>(null);

  const timeAgo = React.useMemo(
    () =>
      formatDistance(new Date(source?.createdAt ?? 0), new Date(), {
        addSuffix: true,
      }),
    [source?.createdAt]
  );
  
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
          setShowMenu(false);
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
        setShowMenu(open);
      },
    [menuRef]
  );

  return (
  <StyledCard>
    <Stack spacing={2}>
      <Stack direction="row"><Typography variant="h6">{source?.title}</Typography>
      <StyledCardMedia><img width={120} height={120} /></StyledCardMedia>
      </Stack>
      <Divider variant="fullWidth" />
      <Stack direction="row" spacing={1}>
        <Typography variant="subtitle2">{timeAgo}</Typography>
        <Box flexGrow={1} />
        <Button onClick={openMenu(true)}>
          <Icon path={mdiDotsHorizontal} size={1} />
        </Button>
        <Menu
          open={showMenu}
          anchorEl={anchorEl}
          onClose={openMenu(false)}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}>
          <StyledBox
            role="presentation"
            onClick={openMenu(false)}
            onKeyDown={openMenu(false)}
            onTouchMove={openMenu(false)}
            ref={menuRef}
          >
            <List>
              <MenuItem>
                <Link
                  variant="caption"
                  href={source?.url}
                  target="_blank"
                  color="inherit"
                >
                  View Original Source
                </Link>
              </MenuItem>
          </List>
          </StyledBox>
        </Menu>
      </Stack>
    </Stack>
  </StyledCard>
  );
}
