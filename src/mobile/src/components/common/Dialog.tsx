import React from 'react';
import {
  Animated,
  GestureResponderEvent,
  LayoutRectangle,
  Pressable,
  View,
} from 'react-native';

import { useTheme } from '~/hooks';

export type DialogProps = React.PropsWithChildren<{
  visible?: boolean;
  onClose?: () => void;
}>;

export function Dialog({
  children,
  visible,
  onClose,
}: DialogProps) {
  const theme = useTheme();
  
  const opacityValue = React.useRef(new Animated.Value(0)).current;
  const refContent = React.useRef<View | Animated.LegacyRef<View>>(null);
  const [layout, setLayout] = React.useState<LayoutRectangle>();
  
  const handlePress = React.useCallback((event: GestureResponderEvent) => {
    const { pageX, pageY } = event.nativeEvent;
    if (
      layout &&
      pageX >= layout.x &&
      pageX <= layout.x + layout.width &&
      pageY >= layout.y &&
      pageY <= layout.y + layout.height) {
      return;
    }
    onClose?.();
  }, [onClose, layout]);
  
  React.useEffect(() => {
    Animated.spring(opacityValue, {
      toValue: visible ? 1 : 0,
      useNativeDriver: true,
    }).start();
  }, [visible, opacityValue]);
  
  return (
    <React.Fragment>
      {visible && (
        <Pressable
          style={ theme.components.dialogBackdrop }
          onPress={ handlePress }>
          <Animated.View
            ref={ refContent }
            onLayout={ (e) => setLayout(e.nativeEvent.layout) }
            style={ [theme.components.dialog, { opacity: opacityValue } ] }>
            {children}
          </Animated.View>
        </Pressable>
      )}
    </React.Fragment>
  );
}