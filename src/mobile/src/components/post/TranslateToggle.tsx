import React from 'react';

import analytics from '@react-native-firebase/analytics';

import { PublicSummaryGroup, RecapAttributes } from '~/api';
import {
  ActivityIndicator,
  ChildlessViewProps,
  Text,
  View,
} from '~/components';
import { useServiceClient } from '~/core';
import { getLocale, strings } from '~/locales';
import { getUserAgent } from '~/utils';

export type TranslateToggleProps<Target extends RecapAttributes | PublicSummaryGroup> = ChildlessViewProps & {
  target: Target;
  translations?: { [key in keyof Target]?: string };
  localize: Target extends RecapAttributes ? ReturnType<typeof useServiceClient>['localizeRecap'] : 
    Target extends PublicSummaryGroup ? ReturnType<typeof useServiceClient>['localizeSummary'] : never;
  onLocalize: (translations?: { [key in keyof Target]?: string }) => void;
};

export type TranslateToggleRef<Target extends RecapAttributes | PublicSummaryGroup> = {
  setTranslations: React.Dispatch<React.SetStateAction<{ [key in keyof Target]?: string | undefined; } | undefined>>
};

export const TranslateToggle = React.forwardRef(function TranslateToggle<Target extends RecapAttributes | PublicSummaryGroup>({
  target,
  translations: translations0,
  localize,
  onLocalize,
}: TranslateToggleProps<Target>, ref?: React.ForwardedRef<Partial<TranslateToggleRef<Target>>>) {
  
  const [translations, setTranslations] = React.useState<{ [key in keyof Target]?: string } | undefined>(translations0);
  const [isLocalizing, setIsLocalizing] = React.useState(false);
  const [translated, setTranslated] = React.useState(Boolean(translations0));
  const [showTranslations, setShowTranslations] = React.useState(Boolean(translations0));
  
  const handleLocalization = React.useCallback(async () => {
    if (/^en/i.test(getLocale()) || isLocalizing) {
      return; 
    }
    analytics().logEvent('localize', { target, userAgent: getUserAgent() });
    setIsLocalizing(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await localize(target as any, getLocale());
      if (error) {
        throw error;
      }
      const translations = Object.fromEntries(Object.values(data.rows).map((t) => [t.attribute, t.value])) as { [key in keyof Target]?: string };
      setTranslations(translations);
      setTranslated(true);
      setShowTranslations(true);
      onLocalize(translations);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLocalizing(false);
    }
  }, [isLocalizing, localize, onLocalize, target]);

  React.useImperativeHandle(ref, () => ({ 
    setTranslations: (translations) => {
      setTranslations(translations);
      setTranslated(Boolean(translations));
      setShowTranslations(Boolean(translations));
    },
  }));
  
  if (/^en/i.test(getLocale())) {
    return null;
  }
  
  return (
    <View>
      {!translated ? (
        !isLocalizing ? (
          <Text
            caption 
            bold
            underline
            onPress={ handleLocalization }>
            {strings.action_translate}
          </Text>
        )
          : (
            <View>
              <ActivityIndicator animating />
            </View>
          )
      ) : (
        <Text
          caption 
          bold
          underline
          onPress={ () => {
            onLocalize?.(showTranslations ? undefined : translations);
            setShowTranslations((prev) => !prev);
          } }>
          {showTranslations ? strings.action_showOriginalText : strings.action_showTranslatedText}
        </Text>
      )}
    </View>
  );
});