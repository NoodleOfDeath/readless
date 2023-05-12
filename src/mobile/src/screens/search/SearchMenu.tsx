import React from 'react';

import { Searchbar, Switch } from 'react-native-paper';

import {
  Button,
  Divider,
  Icon,
  Menu,
  ScrollView,
  Text,
  View,
  ViewProps,
} from '~/components';
import { SessionContext } from '~/contexts';
import { useStyles, useTheme } from '~/hooks';

export type SearchMenuProps = Omit<ViewProps, 'children'> & {
  initialValue?: string;
  placeholder?: string;
  onChangeText?: (value: string) => void;
  onClear?: () => void;
  onSubmit?: (value: string) => void;
};

export function SearchMenu({
  initialValue = '',
  placeholder = 'Search',
  onChangeText,
  onClear,
  onSubmit,
  ...props
}: SearchMenuProps) {

  const theme = useTheme();
  const style = useStyles(props);

  const [value, setValue] = React.useState(initialValue);
  const [forceHide, setForceHide] = React.useState<boolean>();

  const { 
    preferences: { 
      searchCanMatchAny,
      searchHistory,
    },
    setPreference,
  } = React.useContext(SessionContext);
  
  const submit = React.useCallback(() => {
    setForceHide(true);
    setTimeout(() => setForceHide(undefined), 200);
    onSubmit?.(value);
    setPreference('searchHistory', (prev) => [...new Set([value, ...(prev ?? [])])].slice(0, 10));
  }, [onSubmit, setPreference, value]);

  return (
    <Menu 
      width={ 300 }
      visible={ forceHide === true ? false : undefined }
      autoAnchor={ (
        <View row gap={ 6 }>
          <Icon name="magnify" size={ 24 } />
          {value && <Text numberOfLines={ 1 } mr={ 6 }>{value}</Text>}
        </View>
      ) }>
      <View gap={ 8 } style={ style }>
        <Searchbar
          placeholder={ placeholder }
          onChangeText={ (text) => {
            onChangeText?.(text); setValue(text); 
          } }
          inputStyle={ theme.components.searchBar }
          value={ value }
          onClearIconPress={ () => {
            onChangeText?.('');
            onClear?.();
          } } 
          onSubmitEditing={ submit } />
        <View row>
          <View row />
          <Button alignCenter row elevated rounded p={ 4 } onPress={ submit }>Search</Button>
        </View>
        <Divider />
        <View gap={ 4 }>
          <Text>Results Must Contain</Text>
          <View row alignCenter gap={ 4 }>
            <Text>Any Words</Text>
            <Switch
              color={ theme.colors.primary }
              value={ !searchCanMatchAny }
              onValueChange={ (value) => setPreference('searchCanMatchAny', value) } />
            <Text>All Words</Text>
          </View>
        </View>
        {(searchHistory ?? []).length > 0 && (
          <View>
            <Divider />
            <View>
              <View row>
                <Text>Search History</Text>
                <View row />
                <Button underline onPress={ () => setPreference('searchHistory', []) }>
                  Clear History
                </Button>
              </View>
              <ScrollView>
                {(searchHistory ?? []).map((s) => (
                  <Text 
                    key={ s }
                    underline
                    onPress={ () => {
                      setValue(s);
                      onChangeText?.(s);
                      submit();
                    } }>
                    {s}
                  </Text>
                ))}
              </ScrollView>
            </View>
          </View>
        )}
      </View>
    </Menu>
  );
}