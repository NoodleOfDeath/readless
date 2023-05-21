import React from 'react';
import { Animated } from 'react-native';

import {
  Button,
  Text,
  View,
  ViewProps,
} from '~/components';
import { useStyles } from '~/hooks';

type CollapseStyle = 'chevron' | 'banner';

export type CollapsedViewProps = ViewProps & {
  title?: React.ReactNode;
  banner?: boolean;
  collapseStyle?: CollapseStyle;
  startCollapsed?: boolean;
  indent?: number;
  onExpand?: () => void;
  onCollapse?: () => void;
};

export function CollapsedView({
  title,
  banner,
  collapseStyle = banner ? 'banner' : 'chevron',
  startCollapsed = true,
  indent = 36,
  onExpand,
  onCollapse,
  children,
  ...props
}: CollapsedViewProps) {

  const style = useStyles(props);

  const [collapsed, setCollapsed] = React.useState(startCollapsed);
  const animation = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.spring(animation, {
        toValue: collapsed ? 0 : 1,
        useNativeDriver: true,
      }),
      Animated.spring(animation, {
        toValue: collapsed ? 0 : 1,
        useNativeDriver: true,
      }),
    ]).start(() => { 
      collapsed ? onCollapse?.() : onExpand?.();
    });
  }, [animation, collapsed, onCollapse, onExpand]);

  return (
    <View style={ style } gap={ 12 }>
      {collapseStyle === 'chevron' && (
        <View row gap={ 12 } alignCenter>
          <Animated.View style={ { 
            transform: [
              { 
                rotate: animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '90deg'],
                }), 
              },
            ],
          } }>
            <Button
              elevated
              p={ 2 }
              rounded
              iconSize={ 24 }
              onPress={ () => setCollapsed((prev) => !prev) }
              startIcon='chevron-right' />
          </Animated.View>
          <View row>
            {typeof title === 'string' ? <Text subtitle1>{title}</Text> : title}
          </View>
        </View>
      )}
      {collapseStyle === 'banner' && (
        <Button
          elevated
          height={ 36 }
          row
          gap={ 12 }
          pt={ 8 }
          alignCenter
          justifyCenter 
          onPress={ () => setCollapsed((prev) => !prev) }>
          <Animated.View style={ { 
            alignItems: 'center',
            justifyContent: 'center',
            transform: [
              { 
                rotate: animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '-180deg'],
                }), 
              },
            ],
          } }>
            <Button
              iconSize={ 24 }
              startIcon='chevron-down' />
          </Animated.View>
        </Button>
      )}
      {!collapsed && (
        <Animated.View style={ { 
          flexGrow: 1,
          marginLeft: collapseStyle === 'chevron' ? indent : 0,
          transform: [
            {
              translateY: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [-100, 0],
              }),
            },
            { scaleY: animation },
          ],
        } }>
          {children}
        </Animated.View>
      )}
    </View>
  );

}