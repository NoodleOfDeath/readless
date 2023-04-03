import React from 'react';
import {
  Button,
  Text,
  View,
} from 'react-native';

import { interpolate } from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';

import WhatsNewCard from './WhatsNewCard';

import { FlexView } from '~/components';
import { window } from '~/constants';
import { useTheme } from '~/hooks';

type Props = {
  onClose?: () => void;
};

const scale = 0.85;
const PAGE_WIDTH = window.width * scale;
const PAGE_HEIGHT = window.height * scale;

export function WhatsNewScreen({ onClose }: Props = {}) {
  const theme = useTheme({
    container: {
      backgroundColor: '#fff',
      borderColor: 'red',
      borderRadius: 8,
      borderWidth: 1,
      flex: 1,
      fontFamily: 'Lato',
    },
  });

  const animationStyle = React.useCallback((value: number) => {
    'worklet';
    const zIndex = interpolate(value, [-1, 0, 1], [10, 20, 30]);
    const rotateZ = `${interpolate(value, [-5, 0, 5], [-35, 0, 35])}deg`;
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

  return (
    <FlexView>
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
        data={ [...new Array(2).keys()] }
        renderItem={ ({ index }) => {
          return (
            <WhatsNewCard key={ index }>
              <View style={ theme.container }>
                <Text
                  style={ {
                    color: 'black',
                    fontSize: 30,
                  } }>
                  welcome to ReadLess!
                </Text>
                <Button onPress={ () => onClose?.() } title="Get Started" />
              </View>
            </WhatsNewCard>
          );
        } }
        customAnimation={ animationStyle } />
    </FlexView>
  );
}
