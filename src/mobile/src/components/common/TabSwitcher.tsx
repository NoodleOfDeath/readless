import React from 'react';
import {
  Animated,
  LayoutRectangle,
  TouchableOpacity,
} from 'react-native';

import {
  ScrollView,
  Text,
  View,
} from '~/components';
import { useTheme } from '~/hooks';

type Props = {
  titles?: React.ReactNode[];
  tabHeight?: number;
  children?: React.ReactNode | React.ReactNode[];
  activeTab?: number;
  onTabChange?: (tab: number) => void;
};

export function TabSwitcher({
  activeTab = 0,
  tabHeight,
  children,
  onTabChange,
  titles, 
}: Props) {
  
  const theme = useTheme();
  const views = React.useMemo(() => Array.isArray(children) ? children : [children], [children]);

  const [switcherLayout, setSwitcherLayout] = React.useState<LayoutRectangle>();
  const translateX = React.useRef(new Animated.Value(0)).current;

  const handleSlide = React.useCallback((tab: number) => {
    Animated.spring(translateX, {
      toValue: tab * Math.ceil(100 / (titles?.length ?? 1)),
      useNativeDriver: true,
    }).start();
  }, [translateX, titles?.length]);
  
  React.useEffect(() => {
    handleSlide(activeTab);
  }, [activeTab, handleSlide]);

  return (
    <Animated.View style={ { flex: 1 } }>
      <View>
        <View 
          row
          outlined
          rounded
          mv={ 16 }
          height={ tabHeight ?? 36 }
          onLayout={ (event) => setSwitcherLayout(event.nativeEvent.layout) }>
          <Animated.View
            style={ {
              backgroundColor: theme.colors.primary,
              borderRadius: 4,
              height: '100%',
              left: 0,
              position: 'absolute',
              top: 0,
              transform: [
                {
                  translateX: translateX.interpolate({
                    inputRange: [0, 100],
                    outputRange: [0, (switcherLayout?.width || 0) - (titles?.length ?? 1) - 1],
                  }),
                },
              ],
              width: `${100 / (titles?.length ?? 1)}%`,
            } } />
          {titles?.map((title, i) => (
            <TouchableOpacity
              key={ i }
              style={ {
                alignItems: 'center',
                borderBottomRightRadius: 0,
                borderColor: '#007aff',
                borderRadius: 4,
                borderRightWidth: 0,
                borderTopRightRadius: 0,
                flex: 1,
                justifyContent: 'center',
              } }
              onPress={ () => {
                onTabChange?.(i);
              } }>
              <Text
                style={ { color: activeTab === i ? theme.colors.contrastText : theme.colors.primary } }>
                {title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <ScrollView>
          <Animated.View>
            {activeTab < views.length && views[activeTab]}
          </Animated.View>
        </ScrollView>
      </View>
    </Animated.View>
  );

}