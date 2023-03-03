import React from "react";
import { Autocomplete, TextField, styled } from "@mui/material";
import { SessionContext } from "@/contexts";

const StyledAutocomplete = styled(Autocomplete)(({ theme }) => ({
  width: "100%",
  maxWidth: 1280,
  margin: "auto",
  alignSelf: "center",
  alignItems: "center",
  textAlign: "center",
}));

export default function SearchBar() {
  const { searchText, searchOptions, setSearchText } =
    React.useContext(SessionContext);

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
      onChange={(_, value, reason) =>
        reason === "clear"
          ? setSearchText("", { clearSearchParams: true })
          : setSearchText(value as string)
      }
      renderInput={(params) => <TextField {...params} />}
    />
  );
}
