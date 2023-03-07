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

import { SourceWithOutletAttr, SourceWithOutletName } from "@/api/Api";
import Icon from "@mdi/react";
import { mdiChevronLeft, mdiDotsHorizontal } from "@mdi/js";
import TruncatedText from "@/components/common/TruncatedText";
import ConsumptionModeSelector from "@/components/ConsumptionModeSelector";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";

export const CONSUMPTION_MODES = [
  // "bulleted",
  "concise",
  "casual",
  "comprehensive",
] as const;

export type ConsumptionMode = (typeof CONSUMPTION_MODES)[number];

type Props = {
  source?: SourceWithOutletAttr | SourceWithOutletName;
  consumptionMode?: ConsumptionMode;
  onChange?: (mode?: ConsumptionMode) => void;
};

const StyledCard = styled(Card)<Props>(({ theme }) => ({
  minWidth: 200,
  display: "flex",
  padding: theme.spacing(2),
  justifyContent: "left",
  textAlign: "left",
}));

const StyledBackButton = styled(Button)<Props>(({ theme }) => ({
  marginRight: theme.spacing(2),
}));

const StyledCardMedia = styled(CardMedia)<Props>(({ theme }) => ({
  width: 120,
  height: 120,
  marginLeft: theme.spacing(2),
  borderRadius: 8,
}));

const StyledCategoryBox = styled(Box)<Props>(({ theme }) => ({
  width: 120,
  height: 120,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: 8,
  background: theme.palette.primary.main,
}));

const StyledStack = styled(Stack)<Props>(({ theme }) => ({
  width: "100%",
}));

const StyledCategoryStack = styled(Stack)<Props>(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  JustifyContent: "center",
  textAlign: "center",
}));

const StyledMenuBox = styled(Box)<Props>(({ theme }) => ({
  width: 250,
}));

export default function Post({
  source,
  consumptionMode,
  onChange,
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

  const icon = React.useMemo(() => {
    return (
    <StyledCategoryBox>
      <StyledCategoryStack>
        <Typography variant="subtitle1">{source?.category}</Typography>
        <Typography variant="subtitle2">{source?.subcategory}</Typography>
      </StyledCategoryStack>
    </StyledCategoryBox>
    );
  }, [source?.category, source?.subcategory]);

  const content = React.useMemo(() => {
    if (!source) return null;
    let text: string = ''
    switch (consumptionMode) {
      case "concise":
        text = source.shortSummary
        break;
      case "casual":
        text = source.summary
        break;
      case "comprehensive":
        text = source.abridged;
        break;
      default:
        text = "";
    }
    return (
      <ReactMarkdown>{text}</ReactMarkdown>
    );
  }, [source, consumptionMode]);
  
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
    <StyledStack spacing={2}>
      <Stack direction="row">
        {consumptionMode !== undefined && (
          <StyledBackButton onClick={() => onChange?.()}>
            <Icon path={mdiChevronLeft} size={1} />
          </StyledBackButton>
        )}
        <Stack spacing={1}>
          <Typography variant="subtitle1">{source?.outletName}</Typography>
          <Typography variant="h6"><TruncatedText maxCharCount={120}>{source?.title}</TruncatedText></Typography>
        </Stack>
        <StyledCardMedia>
          {icon}  
        </StyledCardMedia>
      </Stack>
      <Divider variant="fullWidth" />
      <Stack direction="row" spacing={1}>
        <Typography variant="subtitle2">{timeAgo}</Typography>
        <Box flexGrow={1} />
        <ConsumptionModeSelector consumptionMode={consumptionMode} onChange={(mode) => onChange?.(mode)} />
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
          <StyledMenuBox
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
                  <Button>
                    View Original Source
                  </Button>
                </Link>
              </MenuItem>
          </List>
          </StyledMenuBox>
        </Menu>
      </Stack>
      {consumptionMode !== undefined && <>{content}</>}
    </StyledStack>
  </StyledCard>
  );
}
