import React from 'react';

import { Searchbar } from 'react-native-paper';

import { View, ViewProps } from '~/components';
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

  const [focused, setFocused] = React.useState(false);
  
  const top = React.useMemo(() => focused ? 64 : undefined, [focused]);
  const bottom = React.useMemo(() => focused ? undefined : 32, [focused]);
  
  const submit = React.useCallback((text?: string) => {
    if (text) {
      setValue(text);
    }
    onSubmit?.(text ?? value);
  }, [onSubmit, value]);

  const handleChangeText = React.useCallback((text: string) => {
    onChangeText?.(text);
    setValue(text);
  }, [onChangeText]);

  return (
    <React.Fragment>
      {focused && (
        <View
          absolute  
          left={ 0 }
          right={ 0 }
          top={ 0 }
          bottom={ 0 }
          bg="rgba(0,0,0,0.5)"  
          onPress={ () => setFocused(false) } />
      )}
      <View 
        gap={ 8 }
        absolute
        left={ 32 }
        right={ 32 }
        top={ top }
        bottom={ bottom }
        style={ style }>
        <Searchbar
          onFocus={ () => setFocused(true) }
          onBlur={ () => setFocused(false) }
          placeholder={ placeholder }
          onChangeText={ handleChangeText }
          inputStyle={ theme.components.searchBar }
          value={ value }
          onClearIconPress={ () => {
            handleChangeText('');
            onClear?.();
          } } 
          onSubmitEditing={ () => submit() } />
        {/* <View gap={ 8 }>
        <Button 
          alignCenter 
          elevated 
          rounded 
          p={ 4 } 
          onPress={ () => submit() }>
          Search
        </Button>
      </View>
      <View gap={ 6 }>
        <Button caption onPress={ () => setPreference('searchHistory', []) }>
          Clear History
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
      </View> */}
      </View>
    </React.Fragment>
  );
}