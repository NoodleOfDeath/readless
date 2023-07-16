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
  snoozed?: boolean;
  excluded?: boolean;
};

export function ChannelIcon({
  category, 
  publisher, 
  size = 20,
  snoozed,
  excluded,
  ...props 
}: Props) {
  const theme = useTheme();
  const fallbackComponent = React.useMemo(() => (
    <Chip
      bg={ theme.colors.primaryLight }
      color={ theme.colors.contrastText }
      itemsCenter
      justifyCenter
      adjustsFontSizeToFit
      textCenter
      leftIcon={ category?.icon }
      width={ size }
      height={ size }>
      {publisher?.displayName && publisher?.displayName[0]}
    </Chip>
  ), [theme, category, publisher, size]);
  return (
    <View
      { ...props }
      flexRow
      gap={ 3 }>
      {(snoozed || excluded) && (
        <Icon  
          name={ snoozed ? 'sleep' : 'eye-off' }
          color={ excluded ? 'red' : undefined }
          zIndex={ 2 } />
      )}
      <View 
        borderRadius={ 3 }
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