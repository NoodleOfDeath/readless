import React from 'react';

import { format } from 'date-fns';

import { RecapAttributes } from '~/api';
import { 
  ChildlessViewProps,
  Divider,
  FlatList,
  Icon,
  Screen,
  Text,
  View,
} from '~/components';
import { useSummaryClient } from '~/core';
import { useNavigation, useTheme } from '~/hooks';
import { getFnsLocale } from '~/locales';

export type RecapProps = ChildlessViewProps & {
  recap: RecapAttributes;
};

export function Recap({
  recap,
  ...props
}: RecapProps) {
  const theme = useTheme();
  return (
    <View 
      { ...props }
      p={ 12 }
      gap={ 3 }>
      <View flexRow gap={ 6 } itemsCenter>
        <View row>
          <View>
            <Text bold>
              {recap.title}
            </Text>
            <Text
              color={ theme.colors.textSecondary }>
              { format(new Date(recap.createdAt ?? ''), 'EEEE • PP', { locale: getFnsLocale() }) }
            </Text>
          </View>
        </View> 
        <Icon name="chevron-right" size={ 24 } />
      </View>
    </View>
  );
}

export function OldNewsScreen() {
  
  const { navigate } = useNavigation();
  const { getRecaps } = useSummaryClient();

  const [recaps, setRecaps] = React.useState<RecapAttributes[]>([]);

  const onMount = React.useCallback(async () => {
    try {
      const { data: recaps } = await getRecaps();
      if (!recaps) {
        return;
      }
      setRecaps(recaps.rows);
    } catch (error) {
      console.log(error);
    }
  }, [getRecaps]);

  React.useEffect(() => {
    onMount();
  }, [onMount]);

  return (
    <Screen>
      <FlatList
        data={ recaps }
        renderItem={ ({ item }) => (
          <Recap
            key={ item.id }
            recap={ item }
            onPress={ () => navigate('recap', { recap: item } ) } />
        ) }
        ListHeaderComponentStyle={ { paddingTop: 12 } }
        ListFooterComponentStyle={ { paddingBottom: 12 } }
        ItemSeparatorComponent={ () => <Divider /> }
        estimatedItemSize={ 114 } />
    </Screen>
  );
}