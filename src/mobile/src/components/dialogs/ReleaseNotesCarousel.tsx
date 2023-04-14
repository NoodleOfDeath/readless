import React from 'react';
import { Animated } from 'react-native';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { interpolate } from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';

import {
  AnimatedCard,
  ScrollView,
  View,
} from '~/components';
import { window } from '~/constants';

export type CardData = {
  title?: string;
  content?: React.ReactNode;
};

type Props = {
  data: CardData[];
  onClose: () => void;
};

const scale = 0.75;
const PAGE_WIDTH = window.width * scale;
const PAGE_HEIGHT = window.height * scale;

export function ReleaseNotesCarousel({ data, onClose }: Props) {
  
  const style = {
    backgroundColor: '#8b0000',
    borderColor: '#fff',
    borderRadius: 8,
    borderWidth: 5,
    flex: 1,
    padding: 32,
  };
  const opacityValue = React.useRef(new Animated.Value(1)).current;

  const animationStyle = React.useCallback((value: number) => {
    'worklet';
    const zIndex = interpolate(value, [-1, 0, 1], [10, 20, 30]);
    const rotateZ = `${interpolate(value, [-2, 0, 2], [-35, 0, 35])}deg`;
    const translateX = interpolate(
      value,
      [-1, 0, 1],
      [-window.width, 0, window.width]
    );
    return {
      transform: [{ rotateZ }, { translateX }],
      zIndex,
    };
  }, []);
  
  const dismiss = React.useCallback(() => {
    Animated.timing(opacityValue, {
      duration: 300,
      toValue: 0,
      useNativeDriver: true,
    }).start();
    setTimeout(() => onClose(), 300);
  }, [onClose, opacityValue]);

  return (
    <Animated.View style={ {
      backgroundColor: 'rgba(50, 50, 50, 0.7)', opacity: opacityValue, position: 'absolute', 
    } }>
      <GestureHandlerRootView>
        <Carousel
          loop={ false }
          style={ {
            alignItems: 'center',
            height: window.height,
            justifyContent: 'center',
            width: window.width,
          } }
          width={ PAGE_WIDTH }
          height={ PAGE_HEIGHT }
          data={ data }
          onProgressChange={ (_, a) => a + 1.1 >= data.length && dismiss() }
          renderItem={ ({ index }) => {
            return (
              <AnimatedCard key={ index }>
                {index + 1 < data.length && (
                  <ScrollView
                    contentInsetAdjustmentBehavior="automatic"
                    style={ { height: '100%' } }>
                    <View style={ style }>
                      {data[index].content}
                    </View>
                  </ScrollView>
                )}
              </AnimatedCard>
            );
          } }
          customAnimation={ animationStyle } />
      </GestureHandlerRootView>
    </Animated.View>
  );
}
