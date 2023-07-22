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
  Header,
  Highlighter,
  Icon,
  ScrollView,
  SummaryList,
  Text,
  TranslateToggle,
  View,
} from '~/components';
import { SessionContext } from '~/contexts';
import { 
  useNavigation,
  useServiceClient,
  useSummaryClient,
  useTheme,
} from '~/hooks';
import { getFnsLocale, strings } from '~/locales';

export type RecapProps = ChildlessViewProps & {
  recap: RecapAttributes;
  expanded?: boolean;
  forceUnread?: boolean;
};

export function Recap({
  recap,
  expanded,
  forceUnread = expanded,
  ...props
}: RecapProps) {
  
  const theme = useTheme();
  const { navigation, openSummary } = useNavigation();
  const { localizeRecap } = useServiceClient();
  const { getSummaries } = useSummaryClient();
  
  const { readRecap, readRecaps } = React.useContext(SessionContext);
  
  const [isRead, setIsRead] = React.useState(!forceUnread && recap.id in ({ ...readRecaps }));
  
  const menuItems: MenuItemProps[] = React.useMemo(() => [
    {
      icon: () => <Icon name={ isRead ? 'email-mark-as-unread' : 'email-open' } size={ 24 } />,
      key: `recap-markAs${isRead ? 'Un' : ''}Read-${recap.id}`,
      onPress: async () => {
        setIsRead((prev) => !prev);
        await readRecap(recap);
      },
      text: isRead ? strings.summary_markAsUnRead : strings.summary_markAsRead,
    },
  ], [isRead, recap, readRecap]);
  
  const searchWords = React.useMemo(() => {
    if (!expanded) {
      return [];
    }
    const words: string[] = [];
    const matches = recap.text?.matchAll(/\[(\d+(?:\s*,\s*\d+)*)\]/g);
    if (matches) {
      for (const match of matches) {
        const [, ids] = match;
        words.push(...ids.split(/\s*,\s*/));
      }
    }
    return words;
  }, [recap]);

  const ids = React.useMemo(() => searchWords.map((word) => Number(word)), [searchWords]);
  
  useFocusEffect(React.useCallback(() => {
    if (expanded) {
      navigation?.setOptions({
        header: () => (
          <Header 
            back
            title={ recap?.title }
            subtitle={ format(new Date(recap?.createdAt ?? ''), 'EEEE PP', { locale: getFnsLocale() }) } 
            elevated />
        ),
      });
    } else {
      setIsRead(!forceUnread && recap.id in ({ ...readRecaps }));
    }
  }, [expanded, navigation, recap?.createdAt, recap?.title]));
  
  return expanded ? (
    <React.Fragment>
      <ScrollView flex={ 1 }>
        <View p={ 12 }>
          <Highlighter
            searchWords={ searchWords }
            propsFor={ (text) => ({ onPress: () => openSummary({ summary: Number(text) }) }) }
            highlightStyle={ {
              color: theme.colors.link,
              fontWeight: 'bold',
            } }
            replacementFor={ (text, index) => `${index}` }>
            {recap?.text}
          </Highlighter>
        </View>
      </ScrollView>
      <Divider />
      <View p={ 12 }>
        <Text>{strings.recaps_references}</Text>
      </View>
      <SummaryList
        flex={ 1 }
        fixed
        fetch={ getSummaries }
        specificIds={ ids } />
    </React.Fragment>
  ) : (
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
              <TranslateToggle 
                localize={ async () => await localizeRecap(recap) }
                onLocalize={ (translations) => console.log(translations) } />
              <Text
                caption
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