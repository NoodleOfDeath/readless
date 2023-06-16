import React from 'react';
import { SafeAreaView } from 'react-native';

import { Button } from './Button';
import { View } from './View';

import { useStyles, useTheme } from '~/hooks';

export type BannerActionProps = {
  icon?: string;
  label?: string;
  onPress: () => void;
  disabled?: boolean;
};

export type BannerProps = React.PropsWithChildren & {
  visible?: boolean;
  actions: BannerActionProps[];
  onDismiss?: () => void;
};

export function Banner({ 
  children,
  visible,
  actions,
  onDismiss,
  ...props
}: BannerProps) {

  const theme = useTheme();
  const style = useStyles(props);
  
  const [minimized, setMinimized] = React.useState(false);

  return (
    <React.Fragment>
      {visible && (
        <View
          bg={ theme.colors.primary } 
          style={ style } 
          gap={ 8 }
          p={ 16 }>
          <View height={ 40 }>
            <View justifyCenter row>
              <View>
                <Button 
                  onPress={ ()=> setMinimized(!minimized) }
                  leftIcon={ minimized ? 'chevron-up' : 'chevron-down' }
                  elevated
                  p={ 4 }
                  rounded />
              </View>
              <View row />
              <View>
                <Button 
                  onPress={ ()=> onDismiss?.() }
                  leftIcon={ 'close' }
                  elevated
                  p={ 4 }
                  rounded />
              </View>
            </View>
          </View>
          {minimized === false && (
            <View height={ 250 }>
              {children}
            </View>
          )}
          <SafeAreaView>
            <View height={ 54 } alignCenter>
              <View row alignCenter gap={ 16 }>
                {actions.map((action, index) => (
                  <View key={ index }>
                    <Button
                      elevated
                      haptic
                      rounded
                      p={ 16 }
                      iconSize={ 24 }
                      disabled={ action.disabled }
                      leftIcon={ action.icon }
                      onPress={ action.onPress } />
                  </View>
                ))}
              </View>
            </View>
          </SafeAreaView>
        </View>
      )}
    </React.Fragment>
  );
}