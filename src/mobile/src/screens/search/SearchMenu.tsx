import React from 'react';
import {
  Animated,
  Keyboard,
  SafeAreaView,
} from 'react-native';

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
import { strings } from '~/locales';

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
  placeholder = strings.search.search,
  children,
  onChangeText,
  onClear,
  onSubmit,
  ...props
}: SearchMenuProps) {

  const theme = useTheme();
  const style = useStyles(props);
  
  const {
    searchHistory,
    setPreference,
  } = React.useContext(SessionContext);

  const [value, setValue] = React.useState(initialValue);

  const [focused, setFocused] = React.useState(false);
  
  const animation = React.useRef(new Animated.Value(0)).current;
  const childAnimation = React.useRef(new Animated.Value(0)).current;
  
  const top = React.useMemo(() => focused ? 32 : undefined, [focused]);
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
      {focused ? (
        <React.Fragment>
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
          <View 
            gap={ 8 }
            absolute
            left={ 32 }
            right={ 32 }
            top={ top }
            bottom={ bottom }
            style={ style }>
            <Searchbar
              autoFocus
              elevation={ 2 }
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
            <Animated.View style={ [theme.components.card, { transform: [{ scaleY: animation }], zIndex: 10 }] }>
              <View gap={ 12 } p={ 12 }>
                <View>
                  <Button 
                    alignCenter 
                    elevated 
                    rounded 
                    p={ 4 } 
                    onPress={ () => submit() }>
                    {strings.search.search}
                  </Button>
                </View>
                <View gap={ 6 }>
                  <Button caption onPress={ () => setPreference('searchHistory', []) }>
                    {strings.clearSearchHistory}
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
          </View>
        </React.Fragment>
      ) : (
        <SafeAreaView>
          <Button
            absolute
            elevated
            rounded
            touchable
            opacity={ 0.95 }
            p={ 12 }
            bottom={ 12 }
            right={ 12 }
            startIcon="magnify"
            iconSize={ 32 }
            onPress={ () => setFocused(true) } />
        </SafeAreaView>
      )}
    </React.Fragment>
  );
}