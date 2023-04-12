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
  children: React.ReactNode | React.ReactNode[];
  activeTab?: number;
  onTabChange?: (tab: number) => void;
};

export function TabSwitcher({
  activeTab = 0,
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
      toValue: tab * (100 / views.length),
      useNativeDriver: true,
    }).start();
    onTabChange?.(tab);
  }, [onTabChange, translateX, views.length]);

  return (
    <Animated.View style={ { flex: 1 } }>
      <View>
        <View 
          row
          outlined
          rounded
          mv={ 20 }
          height={ 36 }
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
                    outputRange: [0, (switcherLayout?.width || 0) - views.length - 1],
                  }),
                },
              ],
              width: `${100 / views.length}%`,
            } } />
          {views.map((view, i) => (
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
                handleSlide(i);
              } }>
              <Text
                style={ { color: activeTab === i ? theme.colors.contrastText : theme.colors.primary } }>
                {titles && titles.length > i ? titles[i] : `Tab ${i + 1}`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <ScrollView>
          <Animated.View>
            {views[activeTab]}
          </Animated.View>
        </ScrollView>
      </View>
    </Animated.View>
  );

}