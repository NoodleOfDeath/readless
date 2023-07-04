import React from 'react';
import { LayoutRectangle } from 'react-native';

import Carousel, { Pagination } from 'react-native-snap-carousel';

import {
  Button,
  ChildlessViewProps,
  Image,
  Text,
  View,
} from '~/components';
import { useTheme } from '~/hooks';

export type CardStackEntryProps = {
  id: string;
  image?: string | React.ReactNode;
  title?: string;
  subtitle?: string;
  onPress?: () => void;
  onClose?: () => void;
};

export function CardStackEntry({
  image: imageUri, 
  title, 
  subtitle, 
  onPress,
  onClose,
}: CardStackEntryProps) {

  const theme = useTheme();

  const image = React.useMemo(() => {
    if (typeof imageUri !== 'string') {
      return imageUri;
    }
    return (
      <Image 
        width="100%"
        height="100%"
        source={ { uri: imageUri } } />
    );
  }, [imageUri]);

  return (
    <View
      touchable
      elevated
      p={ 12 }
      rounded
      gap={ 12 }
      bg={ theme.colors.primary }
      onPress={ onPress }>
      <View
        height={ 120 }
        mt={ -12 }
        mx={ -12 }
        brTopLeft={ 6 }
        brTopRight={ 6 }
        overflow='hidden'>
        <View flexRow absolute z={ 3 } p={ 6 }>
          <View row />
          <Button
            leftIcon="close"
            onPress={ onClose } />
        </View>
        { image }
      </View>
      <View>
        <Text system color={ theme.colors.contrastText }>{ title }</Text>
        {subtitle && (
          <Text color={ theme.colors.contrastText } system numberOfLines={ 2 }>
            { subtitle }
          </Text>
        )}
      </View>
    </View>
  );
}

export type CardStackProps = ChildlessViewProps & {
  cards?: CardStackEntryProps[];
  onPressItem?: (index: number) => void;
  onClose?: () => void;
};

export function CardStack({ 
  cards = [], 
  onPressItem,
  onClose,
  ...props
}: CardStackProps = {}) {
  
  const theme = useTheme();

  const [layout, setLayout] = React.useState<LayoutRectangle>();
  const refCarousel = React.useRef<Carousel<CardStackEntryProps>>(null);
  const [activeSlide, setActiveSlide] = React.useState(0);
  
  const renderItem = React.useCallback(({ item, index }: {item: CardStackEntryProps, index: number}) => (
    <View 
      touchable
      overflow='visible'
      onPress={ () => onPressItem?.(index) }>
      <CardStackEntry 
        { ...item }
        onClose={ onClose } />
    </View>
  ), [onClose, onPressItem]);

  return (
    <View 
      px={ 18 }
      overflow='visible'
      { ...props }>
      <View
        onLayout={ (e) => setLayout(e.nativeEvent.layout) }
        overflow='visible'>
        {layout && (
          <React.Fragment>
            <Carousel
              ref={ refCarousel }
              data={ cards }
              layout={ 'tinder' } 
              renderItem={ renderItem }
              sliderWidth={ layout.width }
              itemWidth={ layout.width }
              hasParallaxImages
              firstItem={ activeSlide }
              inactiveSlideScale={ 0.94 }
              inactiveSlideOpacity={ 0.3 }
              containerCustomStyle={ { overflow: 'visible' } }
              loop
              autoplay
              autoplayDelay={ 500 }
              autoplayInterval={ 7_000 }
              onSnapToItem={ setActiveSlide } />
            <Pagination
              dotsLength={ cards.length }
              activeDotIndex={ activeSlide }
              containerStyle={ {} }
              dotColor={ theme.colors.text }
              dotStyle={ {} }
              inactiveDotColor={ theme.colors.textSecondary }
              inactiveDotOpacity={ 0.8 }
              inactiveDotScale={ 0.6 }
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              carouselRef={ refCarousel as any }
              tappableDots={ Boolean(refCarousel) } />
          </React.Fragment>
        )}
      </View>
    </View>
  );
}