import React from 'react';

import {
  Button,
  View,
  ViewProps,
} from '~/components';

export type CardStackProps = Omit<ViewProps, 'children'> & {
  children?: React.ReactNode | React.ReactNode[];
};

export function CardStack({ children }: CardStackProps = {}) {

  const [cardIndex, setCardIndex] = React.useState(0);

  const cards = React.useMemo(() => {
    if (!children) {
      return [];
    }
    return (Array.isArray(children) ? children : [children]).map((child, i) => (
      <View key={ i }>
        {child}
      </View>
    ));
  }, [children]);

  return (
    <View gap={ 6 }>
      <Button
        startIcon="close"
        onPress={ () => setCardIndex((cardIndex + 1) % cards.length) } />
      {cards[cardIndex]}
    </View>
  );
}