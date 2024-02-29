import React from 'react';
import { TextInput } from 'react-native';

import { Searchbar } from 'react-native-paper';

import { ChildlessViewProps, View } from '~/components';
import { LayoutContext } from '~/contexts';
import { useNavigation, useTheme } from '~/hooks';
import { strings } from '~/locales';

type TextInputHandles = Pick<
  TextInput,
  'blur' | 'clear' | 'focus' | 'isFocused' | 'setNativeProps'
>;

type SearchViewControllerProps = ChildlessViewProps & {
  initialValue?: string;
  placeholder?: string;
  autoFocus?: boolean;
  onChangeText?: (value: string) => void;
  onClear?: () => void;
  onSubmit?: (value: string) => void;
};

export function SearchViewController({
  initialValue = '',
  placeholder = strings.search,
  autoFocus,
  onChangeText,
  onClear,
  onSubmit,
  ...props
}: SearchViewControllerProps) {

  const theme = useTheme();
  const { search } = useNavigation();
  
  const { screenWidth } = React.useContext(LayoutContext);

  const [value, setValue] = React.useState(initialValue);

  const searchRef = React.useRef<TextInputHandles>(null);
  
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
    <View
      gap={ 8 } 
      alignCenter
      width={ screenWidth - (160 / 2) }
      { ...props }>
      <Searchbar
        ref={ searchRef }
        autoFocus={ autoFocus }
        accessible
        accessibilityLabel={ strings.search }
        onIconPress={ () => searchRef.current?.focus() }
        placeholder={ placeholder }
        onChangeText={ handleChangeText }
        style={ { height: 32, padding: 0 } }
        inputStyle={ {
          ...theme.components.searchBar,
          color: theme.colors.text,
          margin: 0,
          padding: -10,
          top: -12,
        } }
        value={ value }
        onClearIconPress={ () => {
          handleChangeText('');
          onClear?.();
        } } 
        onSubmitEditing={ () => submit() } />
    </View>
  );
}
