import React from "react";
import { Stack, styled as muiStyled } from "@mui/material";
import ConsumptionModeSelector from "@/pages/home/ConsumptionModeSelector";
import SearchBar from "@/pages/home/SearchBar";

const StyledStack = muiStyled(Stack)(({ theme }) => ({
  width: "100%",
  maxWidth: 1280,
  margin: "auto",
  alignSelf: "center",
  alignItems: "center",
  textAlign: "center",
}));

export default function Filters() {
  return (
    <StyledStack>
      <SearchBar />
      <ConsumptionModeSelector />
    </StyledStack>
  );
}
