import React from 'react';
import { Button, Text, View } from 'react-native';
import { interpolate } from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';

import { window } from '../../constants';
import { useTheme } from '../../components/theme';
import FlexView from '../../components/common/FlexView';
import OnboardingCard from './OnboardingCard';

type Props = {
  onClose?: () => void;
}

const scale = 0.85;
const PAGE_WIDTH = window.width * scale;
const PAGE_HEIGHT = window.height * scale;

export default function OnboardingScreen({
  onClose,
}: Props = {}) {
  const theme = useTheme({
    container: {
      flex: 1,
      fontFamily: 'Lato',
      backgroundColor: '#fff',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: 'red',
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
        loop={false}
        style={{
          width: window.width,
          height: window.height,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        width={PAGE_WIDTH}
        height={PAGE_HEIGHT}
        data={[...new Array(6).keys()]}
        renderItem={({ index }) => {
          return (
            <OnboardingCard key={index}>
              <View style={theme.container}>
                <Text
                  style={{
                    fontSize: 30,
                    color: 'black',
                  }}
                >
                  welcome to theSkoop!
                </Text>
                {index >= 4 && (
                  <Button onPress={() => onClose?.()} title="Get Started" />
                )}
              </View>
            </OnboardingCard>
          );
        }}
        customAnimation={animationStyle}
      />
    </FlexView>
  );
}
