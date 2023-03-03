import React from "react";
import { Stack, styled } from "@mui/material";
import ConsumptionModeSelector from "@/pages/search/ConsumptionModeSelector";
import SearchBar from "@/pages/search/SearchBar";

const StyledStack = styled(Stack)(({ theme }) => ({
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
