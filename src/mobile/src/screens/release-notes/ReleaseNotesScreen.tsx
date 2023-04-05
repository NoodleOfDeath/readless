import React from 'react';
import { Image } from 'react-native';

import { interpolate } from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';

import {
  AnimatedCard,
  Button,
  Code,
  Icon,
  Strong,
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
      backgroundColor: '#8b0000',
      borderColor: '#fff',
      borderRadius: 8,
      borderWidth: 5,
      flex: 1,
      padding: 32,
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
      <View col justifyCenter>
        <Text fontSize={ 32 }>
          Welcome -
        </Text>
        <Text right fontSize={ 32 } mb={ 8 }>Beta tester!</Text>
        <View outlined={ ['#fff', 2] } rounded p={ 8 } bg='red' mb={ 8 }>
          <Strong center fontSize={ 26 }>
            TL;DR
          </Strong>
          <Text center fontSize={ 20 }>
            Don&apos;t expect much... yet!
          </Text>
        </View>
        <Text fontSize={ 18 } mv={ 8 }>
          As the first official version release of this app, it will be very minimal, but I hope to add A LOT more features in the future including the ability to follow categories, topics, and authors so you do not have to search through ALL of the news.
        </Text>
        <View alignEnd mt={ 16 }>
          <Text fontSize={ 18 }>Swipe right!</Text>
          <Icon name='arrow-right' size={ 40 } color='contrastText' mv={ 8 } />
          <Text fontSize={ 18 }>...or well swipe from the right to the left to continue</Text>
        </View>
      </View>
    ),
    title: 'Welcome to Read &apos; Less',   
  },
  {
    content: (
      <View col justifyCenter>
        <Text fontSize={ 32 }>
          Beta Environment
        </Text>
        <Text right fontSize={ 22 } mb={ 8 }>
          Super Secure Login Deets
        </Text>
        <View outlined={ ['#fff', 2] } rounded p={ 8 } bg='red' mb={ 8 }>
          <Strong center fontSize={ 26 }>
            TL;DR
          </Strong>
          <View alignCenter>
            <Code fontSize={ 20 }>username: dev</Code>
            <Code fontSize={ 20 }>password: dev</Code>
          </View>
        </View>
        <Text fontSize={ 20 } mv={ 8 }>
          This build also points to the the dev environment. So if you decide you want to sign up, when verifying your email, you will need to also provide a username and password to access the dev environment.
        </Text>
        <View alignEnd>
          <Icon name='arrow-right' size={ 40 } color='contrastText' mv={ 8 } />
          <Text fontSize={ 22 }>This doesn&apos;t count as a swipe left!</Text>
        </View>
      </View>),
  },
  {
    content: (
      <View col justifyCenter>
        <Text fontSize={ 32 } mb={ 8 }>
          What&apos;s Next?
        </Text>
        <View outlined={ ['#fff', 2] } rounded p={ 8 } bg='red' mb={ 8 }>
          <Strong center fontSize={ 26 }>
            TL;DR
          </Strong>
          <Text center fontSize={ 22 }>
            Use this app to READ LESS and LIVE MORE!
          </Text>
        </View>
        <Text fontSize={ 18 } mv={ 8 }>
          Honestly, huge thanks to all of you for volunteering to be a beta tester! Who knows where this app will go, but I hope you enjoy it and it will help you stay up to date with the latest news! 
        </Text>
        <View alignEnd>
          <Button onPress={ () => onClose?.() } fontSize={ 40 } color={ '#fff' }>
            <Text right fontSize={ 40 }>Let&apos;s Freakin&apos; Goooo!</Text>
          </Button>
          <Icon name='arrow-right' size={ 40 } color='contrastText' />
        </View>
      </View>
    ),
  },
  ] as CardData[], [onClose]);

  return (
    <View bg={ 'rgba(255,80,80,0.3)' }>
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
                <View center>
                  <Image source={ { uri: 'Logo' } } style={ { height: 80, width: 180 } } />
                </View>
                { CARD_DATA[index].content }
              </View>
            </AnimatedCard>
          );
        } }
        customAnimation={ animationStyle } />
    </View>
  );
}
