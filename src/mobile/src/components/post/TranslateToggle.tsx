import React from 'react';

import analytics from '@react-native-firebase/analytics';

import { PublicSummaryGroup, RecapAttributes } from '~/api';
import {
  ActivityIndicator,
  ChildlessViewProps,
  Text,
  View,
} from '~/components';
import { useApiClient } from '~/core';
import { getLocale, strings } from '~/locales';
import { getUserAgent } from '~/utils';

export type TranslateToggleProps<Type extends 'summary' | 'recap', Target extends Type extends 'summary' ? PublicSummaryGroup : RecapAttributes> = ChildlessViewProps & {
  type: Type;
  target: Target;
  translations?: { [key in keyof Target]?: string };
  localize: Target extends RecapAttributes ? ReturnType<typeof useApiClient>['localize'] : 
    Target extends PublicSummaryGroup ? ReturnType<typeof useApiClient>['localize'] : never;
  onLocalize: (translations?: { [key in keyof Target]?: string }) => void;
};

export type TranslateToggleRef<Target extends RecapAttributes | PublicSummaryGroup> = {
  setTranslations: React.Dispatch<React.SetStateAction<{ [key in keyof Target]?: string | undefined; } | undefined>>
};

export const TranslateToggle = React.forwardRef(function TranslateToggle<Type extends 'summary' | 'recap', Target extends Type extends 'summary' ? PublicSummaryGroup : RecapAttributes>({
  type,
  target,
  translations: translations0,
  localize,
  onLocalize,
}: TranslateToggleProps<Type, Target>, ref?: React.ForwardedRef<Partial<TranslateToggleRef<Target>>>) {
  
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
      const { data, error } = await localize({
        locale: getLocale(),
        resourceId: target.id, 
        resourceType: type,
      });
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
  }, [isLocalizing, localize, onLocalize, type, target]);

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