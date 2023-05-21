import React from 'react';
import { Animated, Keyboard } from 'react-native';

import { Searchbar } from 'react-native-paper';

import { 
  Button,
  Divider,
  ScrollView,
  View,
  ViewProps,
} from '~/components';
import { SessionContext } from '~/contexts';
import { useStyles, useTheme } from '~/hooks';
import { locales } from '~/locales';

export type SearchMenuProps = ViewProps & {
  initialValue?: string;
  placeholder?: string;
  subview?: React.ReactNode;
  onChangeText?: (value: string) => void;
  onClear?: () => void;
  onSubmit?: (value: string) => void;
};

export function SearchMenu({
  initialValue = '',
  placeholder = locales.search,
  children,
  onChangeText,
  onClear,
  onSubmit,
  ...props
}: SearchMenuProps) {

  const theme = useTheme();
  const style = useStyles(props);
  
  const {
    preferences: { searchHistory },
    setPreference,
  } = React.useContext(SessionContext);

  const [value, setValue] = React.useState(initialValue);

  const [focused, setFocused] = React.useState(false);
  
  const animation = React.useRef(new Animated.Value(0)).current;
  const childAnimation = React.useRef(new Animated.Value(0)).current;
  
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
  
  React.useEffect(() => {
    Animated.spring(animation, {
      toValue: focused ? 1 : 0,
      useNativeDriver: true,
    }).start();
  }, [focused, animation]);
  
  React.useEffect(() => {
    Animated.spring(childAnimation, {
      toValue: !focused && children ? 1 : 0,
      useNativeDriver: true,
    }).start();
  }, [children, focused, childAnimation]);

  return (
    <React.Fragment>
      {focused && (
        <Animated.View
          style={ {
            backgroundColor: 'rgba(0,0,0,0.5)',
            bottom: 0,
            left: 0,
            opacity: animation.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1],
            }),
            position: 'absolute',
            right: 0,
            top: 0,
          } }>
          <View
            col
            onPress={ () => {
              setFocused(false);
              Keyboard.dismiss();
            } } />
        </Animated.View>
      )}
      <View 
        gap={ 8 }
        absolute
        opacity={ focused ? 1 : 0.85 }
        left={ 32 }
        right={ 32 }
        top={ top }
        bottom={ bottom }
        style={ style }>
        <Searchbar
          elevation={ 2 }
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
        {focused && (
          <Animated.View style={ [theme.components.card, { transform: [{ scaleY: animation }] }] }>
            <View gap={ 12 }>
              <View>
                <Button 
                  alignCenter 
                  elevated 
                  rounded 
                  p={ 4 } 
                  onPress={ () => submit() }>
                  {locales.search}
                </Button>
              </View>
              <View gap={ 6 }>
                <Button caption onPress={ () => setPreference('searchHistory', []) }>
                  {locales.clearHistory}
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
          </Animated.View>
        )}
        {!focused && children}
      </View>
    </React.Fragment>
  );
}