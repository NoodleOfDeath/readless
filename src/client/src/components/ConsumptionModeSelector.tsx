import React from "react";

import { Button, ButtonGroup, styled as muiStyled } from "@mui/material";

import { BaseContext } from "@/contexts/BaseContext";
import { CONSUMPTION_MODES } from "@/components/Post";

type Props = {};

const StyledConsumptionModeSelector = muiStyled(ButtonGroup)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  margin: theme.spacing(1),
}));

const StyledConsumptionModeButton = muiStyled(Button)<{ selected: boolean }>(
  ({ theme, selected }) => ({
    backgroundColor: selected ? theme.palette.primary.main : "transparent",
    color: selected ? theme.palette.common.white : theme.palette.primary.main,
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: theme.spacing(1),
    padding: theme.spacing(1),
    margin: theme.spacing(1),
    cursor: "pointer",
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
    },
  })
);

export default function ConsumptionModeSelector({}: Props) {
  const { consumptionMode, setConsumptionMode } = React.useContext(BaseContext);

  return (
    <StyledConsumptionModeSelector>
      {CONSUMPTION_MODES.map((mode) => (
        <StyledConsumptionModeButton
          key={mode}
          onClick={() => setConsumptionMode(mode)}
          selected={mode === consumptionMode}
        >
          {mode}
        </StyledConsumptionModeButton>
      ))}
    </StyledConsumptionModeSelector>
  );
}
