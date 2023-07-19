import React from 'react';
import { Animated, ViewStyle } from 'react-native';

import {
  Icon,
  Popover,
  Text,
  View,
  ViewProps,
} from '~/components';
import { useStyles, useTheme } from '~/hooks';

type CollapseStyle = 'banner';

export type CollapsedViewProps = ViewProps & {
  title?: React.ReactNode;
  titleStyle?: ViewStyle;
  contentStyle?: ViewStyle;
  info?: React.ReactNode;
  collapseStyle?: CollapseStyle;
  initiallyCollapsed?: boolean;
  disabled?: boolean;
  onExpand?: () => void;
  onCollapse?: () => void;
};

export function CollapsedView({
  title,
  titleStyle,
  contentStyle,
  info,
  collapseStyle = 'banner',
  initiallyCollapsed = true,
  disabled = false,
  onExpand,
  onCollapse,
  children,
  ...props
}: CollapsedViewProps) {

  const theme = useTheme();

  const [collapsed, setCollapsed] = React.useState(initiallyCollapsed);
  const animation = React.useRef(new Animated.Value(initiallyCollapsed ? 0 : 1)).current;

  React.useEffect(() => {
    Animated.spring(animation, {
      toValue: collapsed ? 0 : 1,
      useNativeDriver: true,
    }).start(() => { 
      collapsed ? onCollapse?.() : onExpand?.();
    });
  }, [animation, collapsed, onCollapse, onExpand]);

  return (
    <View 
      gap={ 12 }
      { ...props }>
      {collapseStyle === 'banner' && (
        <View 
          bg={ theme.colors.headerBackground }
          flexGrow={ 1 }
          p={ titleStyle?.padding !== undefined ? titleStyle?.padding : 6 }
          style={ titleStyle }>
          <View
            gap={ 12 }
            row
            itemsCenter
            justifyCenter={ !title }
            touchable
            onPress={ () => !disabled && setCollapsed((prev) => !prev) }>
            <Animated.View style={ { 
              alignItems: 'center',
              justifyContent: 'center',
              transform: [
                { 
                  rotate: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [title ? '-90deg' : '0deg', title ? '0deg' : '-180deg'],
                  }), 
                },
              ],
            } }>
              <Icon
                size={ 24 }
                name='menu-down' />
            </Animated.View>
            {title && typeof title === 'string' ? <Text subtitle1 system>{title}</Text> : title}
            {info && (
              <Popover
                anchor={ <Icon size={ 24 } name='information' /> }>
                <Text p={ 12 }>{info}</Text>
              </Popover>
            )}
          </View>
        </View>
      )}
      {!collapsed && children}
    </View>
  );

}