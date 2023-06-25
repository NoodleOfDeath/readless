import React from 'react';
import { TextInput } from 'react-native';

import { SheetManager, SheetProps } from 'react-native-actions-sheet';
import { Searchbar  } from 'react-native-paper';

export type TextInputHandles = Pick<
  TextInput,
  'setNativeProps' | 'isFocused' | 'clear' | 'blur' | 'focus'
>;

import { 
  ActionSheet,
  Button,
  ChildlessViewProps,
  Divider,
  ScrollView,
  View,
} from '~/components';
import { SessionContext } from '~/contexts';
import { useTheme } from '~/hooks';
import { strings } from '~/locales';

export type SearchMenuProps = ChildlessViewProps & {
  initialValue?: string;
  placeholder?: string;
  onChangeText?: (value: string) => void;
  onClear?: () => void;
  onSubmit?: (value: string) => void;
};

export function SearchDialog({
  payload,
  ...props
}: SheetProps<SearchMenuProps>) {

  const { 
    initialValue = '',
    placeholder = strings.search_title,
    onChangeText,
    onClear,
    onSubmit,
  } = payload;

  const theme = useTheme();
  
  const {
    searchHistory,
    setPreference,
  } = React.useContext(SessionContext);

  const [value, setValue] = React.useState(initialValue);
  
  const submit = React.useCallback((text?: string) => {
    if (text) {
      setValue(text);
    }
    SheetManager.hide(props.sheetId);
    onSubmit?.(text ?? value);
  }, [onSubmit, props.sheetId, value]);

  const handleChangeText = React.useCallback((text: string) => {
    onChangeText?.(text);
    setValue(text);
  }, [onChangeText]);

  return (
    <ActionSheet id={ props.sheetId }>
      <View gap={ 8 } mx={ 12 }>
        <Searchbar
          autoFocus
          elevation={ 2 }
          placeholder={ placeholder }
          onChangeText={ handleChangeText }
          inputStyle={ theme.components.searchBar }
          value={ value }
          onClearIconPress={ () => {
            handleChangeText('');
            onClear?.();
          } } 
          onSubmitEditing={ () => submit() } />
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
      </View>
    </ActionSheet>
  );
}