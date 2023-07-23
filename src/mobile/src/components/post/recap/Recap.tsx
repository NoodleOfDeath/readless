import React from 'react';

import { useFocusEffect } from '@react-navigation/native';
import { format } from 'date-fns';

import { RecapAttributes } from '~/api';
import { 
  ChildlessViewProps,
  ContextMenu,
  ContextMenuAction,
  Divider,
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
  const [translations, setTranslations] = React.useState<{ [key in keyof RecapAttributes]?: string }>({ text: recap.text, title: recap.title });

  const menuActions: ContextMenuAction[] = React.useMemo(() => [
    {
      onPress: async () => {
        setIsRead((prev) => !prev);
        readRecap(recap, true);
      },
      title: isRead ? strings.summary_markAsUnRead : strings.summary_markAsRead,
    },
  ], [isRead, recap, readRecap]);
  
  const searchWords = React.useMemo(() => {
    if (!expanded) {
      return [];
    }
    const words: string[] = [];
    const matches = recap.text?.matchAll(/\[(\d+(?:\s*,\s*\d+)*)\]/g);
    if (matches) {
      for (const match of Array.from(matches)) {
        const [, ids] = match;
        words.push(...ids.split(/\s*,\s*/));
      }
    }
    return words;
  }, [expanded, recap.text]);

  const ids = React.useMemo(() => searchWords.map((word) => Number(word)), [searchWords]);
  
  useFocusEffect(React.useCallback(() => {
    if (expanded) {
      navigation?.setOptions({ headerTitle: '' });
    } else {
      setIsRead(!forceUnread && recap.id in ({ ...readRecaps }));
    }
  }, [expanded, forceUnread, navigation, readRecaps, recap.id]));

  const handlePress = React.useCallback(() => {
    if (expanded) {
      return;
    }
    setIsRead((prev) => !prev);
    readRecap(recap);
    navigation?.navigate('recap', { recap });
  }, [expanded, navigation, readRecap, recap]);
  
  return expanded ? (
    <React.Fragment>
      <ScrollView flex={ 1 }>
        <View p={ 12 } gap={ 6 }>
          <Text h6 bold>{translations.title}</Text>
          <TranslateToggle 
            target={ recap }
            localize={ localizeRecap }
            onLocalize={ setTranslations } />
          <Divider />
          <Highlighter
            searchWords={ searchWords }
            propsFor={ (text) => ({ onPress: () => openSummary({ summary: Number(text) }) }) }
            highlightStyle={ {
              color: theme.colors.link,
              fontWeight: 'bold',
            } }
            replacementFor={ (text, index) => `${index}` }>
            {translations.text}
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
    <ContextMenu 
      actions={ menuActions }>
      <View 
        { ...props }
        p={ 12 }
        gap={ 3 }
        opacity={ isRead ? 0.3 : 1.0 }
        onPress={ handlePress }>
        <View flexRow gap={ 6 } itemsCenter>
          <View row>
            <View>
              <Text bold>
                {translations.title}
              </Text>
              <TranslateToggle 
                target={ recap }
                localize={ localizeRecap }
                onLocalize={ setTranslations } />
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
    </ContextMenu>
  );
}