import React from "react";

import { Box, Button, ButtonGroup, styled as muiStyled } from "@mui/material";

import { SessionContext } from "@/contexts";
import { CONSUMPTION_MODES } from "@/components/Post";

type Props = {};
const StyledButtonGroup = muiStyled(ButtonGroup)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  margin: theme.spacing(1),
}));

const StyledButton = muiStyled(Button)<{ selected: boolean }>(
  ({ theme, selected }) => ({
    backgroundColor: selected ? theme.palette.primary.main : "transparent",
    color: selected ? theme.palette.common.white : theme.palette.primary.main,
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: theme.spacing(1),
    padding: theme.spacing(1),
    cursor: "pointer",
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
    },
  })
);

export default function ConsumptionModeSelector({}: Props) {
  const {
    preferences: { consumptionMode = "concise" },
    setConsumptionMode,
  } = React.useContext(SessionContext);

  return (
    <StyledButtonGroup variant="outlined" aria-label="outlined button group">
      {CONSUMPTION_MODES.map((mode) => (
        <StyledButton
          key={mode}
          onClick={() => setConsumptionMode(mode)}
          selected={mode === consumptionMode}
        >
          {mode}
        </StyledButton>
      ))}
    </StyledButtonGroup>
  );
}
