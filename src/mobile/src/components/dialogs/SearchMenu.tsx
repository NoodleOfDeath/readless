import React from 'react';

import { Searchbar } from 'react-native-paper';

import {
  Button,
  ChildlessViewProps,
  Divider,
  ScrollView,
  View,
} from '~/components';
import { SessionContext } from '~/contexts';
import { useNavigation, useTheme } from '~/hooks';
import { strings } from '~/locales';

type SearchMenuProps = ChildlessViewProps & {
  initialValue?: string;
  placeholder?: string;
  showHistory?: boolean;
  onChangeText?: (value: string) => void;
  onClear?: () => void;
  onSubmit?: (value: string) => void;
};

export function SearchMenu({
  initialValue = '',
  placeholder = strings.search_title,
  showHistory,
  onChangeText,
  onClear,
  onSubmit,
  ...props
}: SearchMenuProps) {

  const theme = useTheme();
  const { search } = useNavigation();
  
  const {
    searchHistory,
    setPreference,
  } = React.useContext(SessionContext);

  const [value, setValue] = React.useState(initialValue);
  
  const submit = React.useCallback((text?: string) => {
    if (text) {
      setValue(text);
    }
    onSubmit?.(text ?? value);
    search({ prefilter: text ?? value });
  }, [onSubmit, search, value]);

  const handleChangeText = React.useCallback((text: string) => {
    onChangeText?.(text);
    setValue(text);
  }, [onChangeText]);

  return (
    <View gap={ 8 } mx={ 12 } { ...props }>
      <Searchbar
        elevation={ 2 }
        placeholder={ placeholder }
        onChangeText={ handleChangeText }
        inputStyle={ {
          ...theme.components.searchBar,
          flex: 1,
          flexGrow: 1,
          width: 100, 
        } }
        value={ value }
        onClearIconPress={ () => {
          handleChangeText('');
          onClear?.();
        } } 
        onSubmitEditing={ () => submit() } />
      {showHistory && (
        <View style={ theme.components.card }>
          <View gap={ 12 } p={ 12 }>
            <View>
              <Button 
                elevated 
                contained
                onPress={ () => submit() }>
                {strings.action_search}
              </Button>
            </View>
            <View gap={ 6 }>
              <Button caption onPress={ () => setPreference('searchHistory', []) }>
                {strings.action_clearSearchHistory}
              </Button>
              <Divider />
              <ScrollView>
                {searchHistory?.map((item) => (
                  <Button
                    key={ item }
                    underline
                    onPress={ () => {
                      submit(item);
                    } }>
                    {item}
                  </Button>
                ))}
              </ScrollView>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}