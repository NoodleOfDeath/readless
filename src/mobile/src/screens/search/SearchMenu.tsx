import React from 'react';

import { Provider, Searchbar } from 'react-native-paper';

import {
  Button,
  Text,
  View,
  ViewProps,
} from '~/components';
import { useStyles, useTheme } from '~/hooks';

export type SearchMenuProps = Omit<ViewProps, 'children'> & {
  onClear?: () => void;
  onSubmit?: (text: string) => void;
};

export function SearchMenu({
  onClear,
  onSubmit,
  ...props
}: SearchMenuProps) {

  const theme = useTheme();
  const style = useStyles(props);
  
  const [placeholder, _] = React.useState<string>('Search');
  const [searchText, setSearchText] = React.useState('');

  return (
    <Provider>
      <View gap={ 8 }>
        <Searchbar
          placeholder={ placeholder }
          onChangeText={ ((text) => setSearchText(text)) }
          inputStyle={ theme.components.searchBar }
          value={ searchText }
          onClearIconPress={ () => {
            setSearchText('');
            onClear?.();
          } } />
        <View gap={ 4 }>
          <Text>Filters</Text>
          
        </View>
        <View alignEnd justifyCenter gap={ 6 }>
          <View>
            <Button
              elevated
              p={ 4 }
              rounded
              onPress={ () => {
                onSubmit?.(searchText);
              } }>
              Search
            </Button>
          </View>
        </View>
      </View>
    </Provider>
  );
}