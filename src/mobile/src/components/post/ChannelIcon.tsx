import React from 'react';

import { PublicCategoryAttributes, PublicPublisherAttributes } from '~/api';
import {
  Button,
  ChildlessViewProps,
  Icon,
  Image,
  View,
} from '~/components';
import { useTheme } from '~/hooks';
import { publisherIcon } from '~/utils';

type Props = ChildlessViewProps & {
  category?: PublicCategoryAttributes;
  publisher?: PublicPublisherAttributes;
  size?: number;
  excluded?: boolean;
};

export function ChannelIcon({
  category, 
  publisher, 
  size = 20,
  excluded,
  ...props 
}: Props) {
  const theme = useTheme();
  const fallbackComponent = React.useMemo(() => (
    <Button
      bg={ theme.colors.primaryLight }
      color={ theme.colors.contrastText }
      beveled
      itemsCenter
      justifyCenter
      adjustsFontSizeToFit
      textCenter
      leftIcon={ category?.icon }
      iconSize={ size * 0.9 }
      width={ size }
      height={ size }>
      {publisher?.displayName && publisher?.displayName[0]}
    </Button>
  ), [theme, category, publisher, size]);
  return (
    <View
      { ...props }
      flexRow
      gap={ 3 }>
      {excluded && (
        <Icon  
          absolute
          opacity={ 0.7 }
          name={ 'eye-off' }
          color={ 'red' }
          zIndex={ 2 } />
      )}
      <View 
        borderRadius={ 3 }
        opacity={ excluded ? 0.3 : 1.0 }
        overflow="hidden">
        {category ? fallbackComponent : (
          <Image 
            fallbackComponent={ fallbackComponent }
            source={ { uri: publisher ? publisherIcon(publisher) : undefined } }
            width={ size }
            height={ size } />
        ) }
      </View>
    </View>
  );
}