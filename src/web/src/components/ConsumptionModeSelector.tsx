import React from "react";

import { Button, ButtonGroup, styled } from "@mui/material";

import { ConsumptionMode, CONSUMPTION_MODES } from "@/components/Post";

type Props = {
  consumptionMode?: string;
  onChange?: (mode: ConsumptionMode) => void;
};

const StyledButtonGroup = styled(ButtonGroup)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  margin: theme.spacing(1),
}));

const StyledButton = styled(Button)<{ selected: boolean }>(
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

export default function ConsumptionModeSelector({
  consumptionMode,
  onChange,
}: Props = {}) {
  
  return (
    <StyledButtonGroup variant="outlined" aria-label="outlined button group">
      {CONSUMPTION_MODES.map((mode) => (
        <StyledButton
          key={mode}
          onClick={() => onChange?.(mode)}
          selected={mode === consumptionMode}
        >
          {mode}
        </StyledButton>
      ))}
    </StyledButtonGroup>
  );
}
