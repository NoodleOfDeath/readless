import React from 'react';

import {
  Button,
  Text,
  View,
  ViewProps,
} from '~/components';

export type CardStackProps = Omit<ViewProps, 'children'> & {
  children?: React.ReactNode | React.ReactNode[];
  onPressItem?: (index: number) => void;
  onClose?: () => void;
};

export function CardStack({ 
  children, 
  onPressItem,
  onClose,
  ...props
}: CardStackProps = {}) {
  
  const [cardIndex, setCardIndex] = React.useState(0);

  const cards = React.useMemo(() => {
    if (!children) {
      return [];
    }
    return (Array.isArray(children) ? children : [children]).map((child, i) => (
      <React.Fragment key={ i }>
        {child}
      </React.Fragment>
    ));
  }, [children]);
  
  React.useEffect(() => {
    if (cardIndex + 1 > cards.length) {
      setCardIndex(Math.max(cards.length - 1, 0));
    }
  }, [cardIndex, cards]);

  return (
    <View 
      elevated
      touchable
      rounded
      p={ 12 }
      onPress={ () => onPressItem?.(cardIndex) }
      { ...props }>
      <View flexRow>
        <View row />
        <Button
          touchable
          startIcon="close"
          iconSize={ 18 }
          onPress={ () => onClose?.() } />
      </View>
      <View 
        flexRow
        alignCenter
        justifySpaced
        gap={ 6 }>
        <Button
          touchable
          startIcon="chevron-left"
          iconSize={ 32 }
          color={ cardIndex > 0 ? 'text' : 'textDisabled' }
          onPress={ cardIndex > 0 ? () => setCardIndex((cardIndex - 1)) : undefined } />
        <View
          alignCenter
          justifyCenter>
          {cards[cardIndex]}
        </View>
        <Button
          touchable
          startIcon="chevron-right"
          iconSize={ 32 }
          color={ cardIndex + 1 < cards.length ? 'text' : 'textDisabled' }
          onPress={ cardIndex + 1 < cards.length ? () => setCardIndex((cardIndex + 1)) : undefined } />
      </View>
      <View flexRow>
        <View row />
        <Text>{`${cardIndex + 1} / ${cards.length}`}</Text>
      </View>
    </View>
  );
}