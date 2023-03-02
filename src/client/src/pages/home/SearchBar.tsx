import React from "react";
import { Autocomplete, TextField, styled as muiStyled } from "@mui/material";
import { SessionContext } from "@/contexts";

const StyledAutocomplete = muiStyled(Autocomplete)(({ theme }) => ({
  width: "100%",
  maxWidth: 1280,
  margin: "auto",
  alignSelf: "center",
  alignItems: "center",
  textAlign: "center",
}));

export default function SearchBar() {
  const {
    searchCache: { searchText, searchOptions },
    setSearchText,
  } = React.useContext(SessionContext);

  const computedOptions = React.useMemo(
    () => [...searchOptions, searchText],
    [searchOptions, searchText]
  );

  return (
    <StyledAutocomplete
      disablePortal
      placeholder="Search the Skoop..."
      value={searchText}
      options={computedOptions}
      renderInput={(params) => (
        <TextField
          {...params}
          onChange={(event) => setSearchText(event.currentTarget.value)}
        />
      )}
    />
  );
}
