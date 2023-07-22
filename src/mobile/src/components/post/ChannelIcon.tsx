import React from 'react';

import { PublicCategoryAttributes, PublicPublisherAttributes } from '~/api';
import {
  ChildlessViewProps,
  Chip,
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
    <Chip
      { ...props }
      bg={ theme.colors.primaryLight }
      color={ theme.colors.contrastText }
      itemsCenter
      justifyCenter
      adjustsFontSizeToFit
      textCenter
      leftIcon={ category?.icon }
      iconSize={ size * 0.8 }
      width={ size }
      height={ size }>
      {publisher?.displayName && publisher?.displayName[0]}
    </Chip>
  ), [props, theme.colors.primaryLight, theme.colors.contrastText, category?.icon, size, publisher?.displayName]);
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
        borderRadius={ 6 }
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