import React from 'react';
import { Animated, ViewStyle } from 'react-native';

import {
  Divider,
  Icon,
  Menu,
  Text,
  View,
  ViewProps,
} from '~/components';
import { useStyles } from '~/hooks';

type CollapseStyle = 'banner';

export type CollapsedViewProps = ViewProps & {
  title?: React.ReactNode;
  titleStyle?: ViewStyle;
  contentStyle?: ViewStyle;
  info?: React.ReactNode;
  collapseStyle?: CollapseStyle;
  initiallyCollapsed?: boolean;
  disabled?: boolean;
  indent?: number;
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
  indent = 0,
  onExpand,
  onCollapse,
  children,
  ...props
}: CollapsedViewProps) {

  const style = useStyles(props);

  const [collapsed, setCollapsed] = React.useState(initiallyCollapsed);
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
    <View 
      style={ style }
      gap={ 12 }>
      {collapseStyle === 'banner' && (
        <View 
          elevated
          flexGrow={ 1 }
          p={ titleStyle?.padding !== undefined ? titleStyle?.padding : 12 }
          style={ titleStyle }>
          <View
            gap={ 12 }
            row
            alignCenter
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
                name='chevron-down' />
            </Animated.View>
            {title && <Divider vertical />}
            {title && typeof title === 'string' ? <Text subtitle1>{title}</Text> : title}
            {info && (
              <Menu
                anchor={ <Icon size={ 24 } name='information' /> }>
                {info}
              </Menu>
            )}
          </View>
        </View>
      )}
      {!collapsed && (
        <Animated.View style={ { 
          flexGrow: 1,
          marginLeft: contentStyle ? undefined : indent,
          paddingLeft: contentStyle ? undefined : 12,
          paddingRight: contentStyle ? undefined : 12,
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