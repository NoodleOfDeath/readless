import React from 'react';

import { PublicPublisherAttributes } from '~/api';
import {
  ChildlessViewProps,
  Chip,
  Image,
  View,
} from '~/components';
import { useTheme } from '~/hooks';
import { publisherIcon } from '~/utils';

type Props = ChildlessViewProps & {
  publisher: PublicPublisherAttributes;
};

export function PublisherIcon({ publisher, ...props }: Props) {
  const theme = useTheme();
  return (
    <View
      { ...props }
      borderRadius={ 3 }
      overflow="hidden">
      <Image 
        fallbackComponent={ (
          <Chip
            bg={ theme.colors.primaryLight }
            color={ theme.colors.contrastText }
            itemsCenter
            justifyCenter
            adjustsFontSizeToFit
            textCenter
            width={ 20 }
            height={ 20 }>
            {publisher.displayName[0]}
          </Chip>
        ) }
        source={ { uri: publisherIcon(publisher) } }
        width={ 20 }
        height={ 20 } />
    </View>
  );
}