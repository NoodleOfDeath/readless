import React from 'react';

import {
  Autocomplete,
  AutocompleteChangeReason,
  TextField,
  styled,
} from '@mui/material';

import { AppStateContext } from '~/contexts';
import { useRouter } from '~/hooks';

const StyledAutocomplete = styled(Autocomplete)(({ theme }) => ({
  alignItems: 'center',
  alignSelf: 'center',
  margin: 'auto',
  maxWidth: 1280,
  minWidth: theme.breakpoints.down('sm') ? 320 : 500,
  textAlign: 'center',
}));

export default function SearchBar() {
  const {
    searchText, searchSuggestions, setSearchText, 
  } =
    React.useContext(AppStateContext);
  const { setSearchParams } = useRouter();

  const computedOptions = React.useMemo(
    () => [...searchSuggestions, searchText],
    [searchSuggestions, searchText]
  );

  const handleChange = React.useCallback((event: React.SyntheticEvent<Element, Event>, value?: unknown, reason?: AutocompleteChangeReason) => {
    if (reason === 'clear') {
      setSearchText('');
      setSearchParams({ q: '' });
    } else {
      setSearchText(value as string);
    }
  }, [setSearchParams, setSearchText]);

  return (
    <StyledAutocomplete
      disablePortal
      value={ searchText }
      onChange={ handleChange }
      options={ computedOptions }
      renderInput={ (params) => (
        <TextField
          { ...params }
          label="show me something worth reading..."
          onChange={ (event) => handleChange(event, event.currentTarget.value) } />
      ) } />
  );
}
