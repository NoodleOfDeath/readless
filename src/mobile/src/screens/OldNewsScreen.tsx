import React from 'react';

import { useFocusEffect } from '@react-navigation/native';
import { format } from 'date-fns';
import { HoldItem } from 'react-native-hold-menu';
import { MenuItemProps } from 'react-native-hold-menu/lib/typescript/components/menu/types';

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
import { SessionContext } from '~/contexts';
import { useSummaryClient } from '~/core';
import { useNavigation, useTheme } from '~/hooks';
import { getFnsLocale, strings } from '~/locales';

export type RecapProps = ChildlessViewProps & {
  recap: RecapAttributes;
  forceUnread?: boolean;
};

export function Recap({
  recap,
  forceUnread,
  ...props
}: RecapProps) {
  
  const { readRecap, readRecaps } = React.useContext(SessionContext);
  
  const theme = useTheme();
  
  const [isRead, setIsRead] = React.useState(!forceUnread && recap.id in ({ ...readRecaps }));
  
  useFocusEffect(React.useCallback(() => {
    setIsRead(!forceUnread && recap.id in ({ ...readRecaps }));
  }, [forceUnread, readRecaps, recap.id]));

  const menuItems: MenuItemProps[] = React.useMemo(() => [
    {
      icon: () => <Icon name={ isRead ? 'eye-off' : 'eye' } size={ 24 } />,
      key: `recap-markAs${isRead ? 'Un' : ''}Read-${recap.id}`,
      onPress: async () => {
        setIsRead((prev) => !prev);
        await readRecap(recap);
      },
      text: strings.summary_markAsUnRead,
    },
  ], [isRead, recap, readRecap]);
  
  return (
    <HoldItem items={ menuItems }>
      <View 
        { ...props }
        p={ 12 }
        gap={ 3 }
        opacity={ isRead ? 0.3 : 1.0 }>
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
          <Icon name="menu-right" size={ 24 } />
        </View>
      </View>
    </HoldItem>
  );
}

export function OldNewsScreen() {
  
  const { navigate } = useNavigation();
  const { getRecaps } = useSummaryClient();
  const { readRecap, readRecaps } = React.useContext(SessionContext);

  const [recaps, setRecaps] = React.useState<RecapAttributes[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [lastFetchFailed, setLastFetchFailed] = React.useState(false);
  
  const load = React.useCallback(async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      const { data: recaps } = await getRecaps();
      if (!recaps) {
        return;
      }
      setRecaps(recaps.rows);
      setLastFetchFailed(false);
    } catch (error) {
      console.log(error);
      setLastFetchFailed(true);
    } finally {
      setLoading(false);
    }
  }, [loading, getRecaps]);

  useFocusEffect(React.useCallback(() => {
    if (recaps.length === 0 && !lastFetchFailed) {
      load();
    }
  }, [load, recaps, lastFetchFailed]));

  return (
    <Screen>
      <FlatList
        refreshing={ recaps.length === 0 && loading }
        onRefresh={ () => {
          load();
        } }
        data={ recaps }
        renderItem={ ({ item }) => (
          <Recap
            key={ item.id }
            recap={ item }
            onPress={ () => {
              if (!(item.id in ({ ...readRecaps }))) {
                readRecap(item);
              }
              navigate('recap', { recap: item } );
            } } />
        ) }
        ListHeaderComponentStyle={ { paddingTop: 12 } }
        ListHeaderComponent={ (
          <Text mx={ 12 }>
            {strings.recaps_information}
          </Text>
        ) }
        ListFooterComponentStyle={ { paddingBottom: 12 } }
        ItemSeparatorComponent={ () => <Divider /> }
        estimatedItemSize={ 114 } />
    </Screen>
  );
}