import React from 'react';

import { Searchbar } from 'react-native-paper';

import {
  Button,
  Icon,
  Menu,
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
    preferences: { searchHistory },
    setPreference, 
  } = React.useContext(SessionContext);
  
  const submit = React.useCallback((text?: string) => {
    if (text) {
      setValue(text);
    }
    setForceHide(true);
    setTimeout(() => setForceHide(undefined), 200);
    onSubmit?.(text ?? value);
    setTimeout(() => setPreference('searchHistory', (prev) => [...new Set([text ?? value, ...(prev ?? [])])].slice(0, 10)), 500);
  }, [onSubmit, setPreference, value]);

  const handleChangeText = React.useCallback((text: string) => {
    onChangeText?.(text);
    setValue(text);
  }, [onChangeText]);

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
          autoFocus
          placeholder={ placeholder }
          onChangeText={ handleChangeText }
          inputStyle={ theme.components.searchBar }
          value={ value }
          onClearIconPress={ () => {
            handleChangeText('');
            onClear?.();
          } } 
          onSubmitEditing={ () => submit() } />
        <View gap={ 8 }>
          <Button 
            alignCenter 
            elevated 
            rounded 
            p={ 4 } 
            onPress={ () => submit() }>
            Search
          </Button>
        </View>
        <View>
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
        </View>
      </View>
    </Menu>
  );
}