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
import { LayoutContext, SessionContext } from '~/contexts';
import { 
  useNavigation,
  useServiceClient,
  useSummaryClient,
  useTheme,
} from '~/hooks';
import { getFnsLocale, strings } from '~/locales';

export type RecapProps = ChildlessViewProps & {
  recap: RecapAttributes;
  preview?: boolean;
  expanded?: boolean;
  forceUnread?: boolean;
};

export function Recap({
  recap,
  preview,
  expanded,
  forceUnread = preview || expanded,
  ...props
}: RecapProps) {
  
  const theme = useTheme();
  const { navigation, openSummary } = useNavigation();
  const { localizeRecap } = useServiceClient();
  const { getSummaries } = useSummaryClient();
  const { screenHeight } = React.useContext(LayoutContext);
  
  const { readRecap, readRecaps } = React.useContext(SessionContext);
  
  const [isRead, setIsRead] = React.useState(!forceUnread && recap.id in ({ ...readRecaps }));
  const [translations, setTranslations] = React.useState<{ [key in keyof RecapAttributes]?: string }>({ text: recap.text, title: recap.title });

  const bodyText = React.useMemo(() => (translations.text ?? recap.text), [recap.text, translations.text]);

  const menuActions: ContextMenuAction[] = React.useMemo(() => [
    {
      onPress: async () => {
        setIsRead((prev) => !prev);
        readRecap(recap, true);
      },
      systemIcon: isRead ? 'envelope' : 'envelope.open',
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

  const translateToggle = React.useMemo(() => (
    <TranslateToggle 
      target={ recap }
      localize={ localizeRecap }
      onLocalize={ (translations) => {
        if (!translations) {
          setTranslations({ text: recap.text, title: recap.title });
        } else {
          setTranslations(translations);
        }
      } } />
  ), [localizeRecap, recap]);

  const content = React.useMemo(() => (preview || expanded) && (
    <Highlighter
      selectable
      searchWords={ searchWords }
      propsFor={ (text) => ({ onPress: () => openSummary({ summary: Number(text) }) }) }
      highlightStyle={ {
        color: theme.colors.link,
        fontWeight: 'bold',
      } }
      replacementFor={ (_, index) => `${index}` }>
      {bodyText}
    </Highlighter>
  ), [expanded, openSummary, bodyText, preview, searchWords, theme.colors.link]);
  
  const coverCard = React.useMemo(() => (
    <View 
      { ...props }
      p={ 12 }
      gap={ 3 }
      borderRadius={ 12 }
      opacity={ isRead ? 0.3 : 1.0 }
      style={ theme.components.card }
      onPress={ handlePress }>
      <View flexRow gap={ 6 } itemsCenter>
        <View row>
          <View>
            <Text bold>
              {translations.title}
            </Text>
            {!preview && translateToggle}
            <Text
              caption
              color={ theme.colors.textSecondary }>
              { format(new Date(recap.createdAt ?? ''), 'EEEE • PP', { locale: getFnsLocale() }) }
            </Text>
          </View>
        </View> 
        {!preview && <Icon name="menu-right" size={ 24 } />}
      </View>
      {preview && (
        <ScrollView maxHeight={ screenHeight * 0.6 }>
          {content}
        </ScrollView>
      )}
    </View>
  ), [props, isRead, theme.components.card, theme.colors.textSecondary, handlePress, translations.title, preview, translateToggle, recap.createdAt, screenHeight, content]);

  return expanded ? (
    <React.Fragment>
      <View p={ 12 }>
        <Text>{strings.recaps_headlines}</Text>
      </View>
      <SummaryList
        flex={ 1 }
        fixed
        fetch={ getSummaries }
        specificIds={ ids } />
      <ScrollView flex={ 1 }>
        <View
          p={ 12 }
          gap={ 6 }
          style={ theme.components.card }>
          <Text h6 bold selectable>{translations.title}</Text>
          {translateToggle}
          <Divider />
          {content}
        </View>
      </ScrollView>
      <Divider />
    </React.Fragment>
  ) : (
    preview ? <ScrollView flex={ 1 }>{coverCard}</ScrollView> : (
      <ContextMenu 
        actions={ menuActions }
        preview={ (
          <Recap
            preview
            recap={ recap } />
        ) }>
        {coverCard}
      </ContextMenu>
    )
  );
}