import React from 'react';

import { interpolate } from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';

import {
  AnimatedCard,
  Button,
  Text,
  View,
} from '~/components';
import { window } from '~/constants';
import { useTheme } from '~/hooks';

type Props = {
  onClose?: () => void;
};

const scale = 0.85;
const PAGE_WIDTH = window.width * scale;
const PAGE_HEIGHT = window.height * scale;

type CardData = {
  title?: string;
  content?: React.ReactNode;
};

export function ReleaseNotesScreen({ onClose }: Props = {}) {
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

  const CARD_DATA: CardData[] = React.useMemo(() => [{
    content: (
      <View col center>
        <Text>
          As a Beta tester I would love to hear your feedback! The first official version release of this app will be very minimal (aka much like this build), but I hope to add A LOT more features in the future including the ability to follow categories, topics, and authors so you do not have to search through ALL of the news.
        </Text>
      </View>     ),
    title: 'Welcome to Read &apos; Less',   
  },
  {
    content: (
      <View col center>
        <Text>
          This build also points to the the dev environment. When verifying your email, you will need to also provide a username and password to access the dev environment. The username is &apos;dev&apos; and the password is &apos;readless&#24;&#24;!&apos;. This will be changed to a more user-friendly experience in the future.
        </Text>
      </View>),
  },
  {
    content: (
      <View col center>
        <Text>
          I hope you enjoy the app and please let me know if you have any questions or feedback. Also, this carousel will be replaced with a more user-friendly onboarding experience.
        </Text>
        <Button onPress={ () => onClose?.() }>
          Letapos;s Get Started!
        </Button>
      </View>
    ),
  },
  ] as CardData[], [onClose]);

  return (
    <View>
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
        data={ CARD_DATA }
        renderItem={ ({ index }) => {
          return (
            <AnimatedCard key={ index }>
              <View style={ theme.container }>
                { CARD_DATA[index].content }
              </View>
            </AnimatedCard>
          );
        } }
        customAnimation={ animationStyle } />
    </View>
  );
}
