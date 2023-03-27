import React from 'react';

import {
  Autocomplete,
  TextField,
  styled,
} from '@mui/material';

import { SessionContext } from '@/contexts';

const StyledAutocomplete = styled(Autocomplete)(() => ({
  alignItems: 'center',
  alignSelf: 'center',
  margin: 'auto',
  maxWidth: 1280,
  textAlign: 'center',
  width: '100%',
}));

export default function SearchBar() {
  const {
    searchText, searchOptions, setSearchText, 
  } =
    React.useContext(SessionContext);

  const computedOptions = React.useMemo(
    () => [...searchOptions, searchText],
    [searchOptions, searchText]
  );

  return (
    <StyledAutocomplete
      disablePortal
      value={ searchText }
      onChange={ (_, value, reason) =>
        reason === 'clear'
          ? setSearchText('', { clearSearchParams: true })
          : setSearchText(value as string) }
      options={ computedOptions }
      renderInput={ (params) => (
        <TextField
          { ...params }
          label="What's the skoop?"
          onChange={ (event) => setSearchText(event.currentTarget.value) } />
      ) } />
  );
}
