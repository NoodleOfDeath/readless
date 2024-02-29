import React from 'react';
import { LayoutRectangle } from 'react-native';

import Carousel from 'react-native-reanimated-carousel';

import {
  Button,
  ChildlessViewProps,
  Image,
  Text,
  View,
} from '~/components';
import { useTheme } from '~/hooks';

export type CardStackEntryProps = ChildlessViewProps & {
  id: string;
  image?: React.ReactNode | string;
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
  ...props
}: CardStackEntryProps) {

  const theme = useTheme();

  const image = React.useMemo(() => {
    if (typeof imageUri !== 'string') {
      return imageUri;
    }
    return (
      <Image source={ { uri: imageUri } } />
    );
  }, [imageUri]);

  return (
    <View
      { ...props }
      elevated
      p={ 12 }
      beveled 
      width="100%"
      height={ 200 }
      gap={ 12 }
      bg={ theme.colors.primary }
      onPress={ onPress }>
      <View
        mt={ -12 }
        mx={ -12 }
        width="100%"
        height={ 200 }
        bg='yellow'
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
  
  const [layout, setLayout] = React.useState<LayoutRectangle>();
  const [activeSlide, setActiveSlide] = React.useState(0);
  
  const renderItem = React.useCallback(({ item, index }: {item: CardStackEntryProps, index: number}) => (
    <View 
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
        bg='blue'
        flexGrow={ 1 }
        my={ 6 }
        onLayout={ (e) => setLayout(e.nativeEvent.layout) }
        overflow='visible'>
        {layout && (
          <React.Fragment>
            <Carousel
              data={ cards }
              defaultIndex={ activeSlide }
              renderItem={ renderItem }
              width={ layout.width }
              loop
              autoPlay
              autoPlayInterval={ 7_000 }
              onSnapToItem={ setActiveSlide } />
          </React.Fragment>
        )}
      </View>
    </View>
  );
}