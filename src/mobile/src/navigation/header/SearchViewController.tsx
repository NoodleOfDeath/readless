import React from 'react';
import { LayoutRectangle, TextInput } from 'react-native';

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
  onChangeText?: (value: string) => void;
  onClear?: () => void;
  onSubmit?: (value: string) => void;
};

export function SearchViewController({
  initialValue = '',
  placeholder = strings.search,
  onChangeText,
  onClear,
  onSubmit,
  ...props
}: SearchViewControllerProps) {

  const theme = useTheme();
  const { search } = useNavigation();
  
  const { screenWidth } = React.useContext(LayoutContext);

  const [value, setValue] = React.useState(initialValue);
  const [_showMenu, setShowMenu] = React.useState(false);
  const [_searchbarLayout, setSearchbarLayout] = React.useState<LayoutRectangle>({
    height: 0, width: 0, x: 0, y: 0, 
  });

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
        autoFocus
        accessible
        accessibilityLabel={ strings.search }
        onLayout={ (e) => setSearchbarLayout(e.nativeEvent.layout) }
        onIconPress={ () => searchRef.current?.focus() }
        placeholder={ placeholder }
        onFocus={ () => setShowMenu(true) }
        onBlur={ () => setShowMenu(false) }
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
