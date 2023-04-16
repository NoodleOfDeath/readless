import React from 'react';
import { Animated } from 'react-native';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { interpolate } from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';

import { ReleaseAttributes } from '~/api';
import {
  AnimatedCard,
  Markdown,
  View,
} from '~/components';
import { window } from '~/constants';
import { useTheme } from '~/hooks';

type Props = {
  data: ReleaseAttributes[];
  onClose: () => void;
};

const scale = 0.75;
const PAGE_WIDTH = window.width * scale;
const PAGE_HEIGHT = window.height * scale;

const style = {
  backgroundColor: '#8b0000',
  borderColor: '#fff',
  borderRadius: 8,
  borderWidth: 5,
  flex: 1,
  padding: 32,
};

export function ReleaseNotesCarousel({ data, onClose }: Props) {
  const theme = useTheme();

  const dataWithOffset = React.useMemo(() => {
    return [...data
      .map((release) => {
        return release.description.split('-----')
          .map((description) => ({ 
            ...release, 
            description: description
              .trim()
              .replace(
                /\{\{DisplayMode\}\}/gi, 
                (theme.isLightMode ? 'light' : 'dark').replace(/^\w/g, ($0) => $0.toUpperCase())
              ),
          }));
      }).flat(), { description:'' }];
  }, [theme.isLightMode, data]);

  const animationStyle = React.useCallback((value: number) => {
    'worklet';
    const zIndex = interpolate(value, [-1, 0, 1], [10, 20, 30]);
    const rotateZ = `${interpolate(value, [-0.5, 0, 0.5], [-10, 0, 10])}deg`;
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
    onClose?.();
  }, [onClose]);

  return (
    <Animated.View style={ { backgroundColor: 'rgba(50, 50, 50, 0.7)', position: 'absolute' } }>
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
          data={ dataWithOffset }
          onProgressChange={ (_, a) => {
            if (a + 1.1 >= dataWithOffset.length) {
              dismiss();
            }
          } }
          renderItem={ ({ index }) => {
            return (
              <AnimatedCard key={ index }>
                {index + 1 < dataWithOffset.length && (
                  <View col justifyCenter style={ style }>
                    {dataWithOffset[index].description.split('\n\n').map((p, i) => {
                      return (
                        <View key={ i }>
                          <Markdown
                            textStyles={ { color: theme.colors.contrastText } }>
                            {p}
                          </Markdown>
                        </View>
                      );
                    })}
                  </View>
                )}
              </AnimatedCard>
            );
          } }
          customAnimation={ animationStyle } />
      </GestureHandlerRootView>
    </Animated.View>
  );
}
