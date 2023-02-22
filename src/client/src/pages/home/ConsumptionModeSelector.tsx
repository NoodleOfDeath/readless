import React from "react";

import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Stack,
  styled as muiStyled,
  Typography,
} from "@mui/material";

import { BaseContext } from "@/contexts/BaseContext";
import { CONSUMPTION_MODES } from "@/components/Post";

type Props = {};

const StyledContainer = muiStyled(Container)(({ theme }) => ({
  backgroundColor: "transparent",
  width: "100%",
  maxWidth: 1280,
  margin: "auto",
  marginTop: theme.spacing(5),
  alignSelf: "center",
  alignItems: "center",
  textAlign: "center",
}));

const StyledStack = muiStyled(Stack)(({ theme }) => ({
  margin: theme.spacing(1),
}));

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
  const { consumptionMode, setConsumptionMode } = React.useContext(BaseContext);

  return (
    <StyledContainer>
      <StyledStack spacing={2}>
        <Typography variant="h6">How much text do you want to read?</Typography>
        <Typography variant="body1">left = less, right = more</Typography>
        <StyledButtonGroup
          variant="outlined"
          aria-label="outlined button group"
        >
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
      </StyledStack>
    </StyledContainer>
  );
}
