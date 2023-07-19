import React from 'react';

import {
  ActivityIndicator,
  ChildlessViewProps,
  Text,
  View,
} from '~/components';
import { getLocale, strings } from '~/locales';

export type TranslateToggleProps<A> = ChildlessViewProps & {
  translated?: boolean;
  localize: () => Promise<A[]>;
  onLocalize: (translations: A[]) => void;
  onToggleTranslate?: (onOrOff: boolean) => void;
};

export function TranslateToggle<A>({
  translated: translated0,
  localize,
  onLocalize,
  onToggleTranslate,
}: TranslateToggleProps<A>) {
  
  const [isLocalizing, setIsLocalizing] = React.useState(false);
  const [translated, setTranslated] = React.useState(translated0);
  const [showTranslations, setShowTranslations] = React.useState(translated0);
  
  const handleLocalization = React.useCallback(async () => {
    try {
      const translations = await localize();
      onLocalize?.(translations);
      setTranslated(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLocalizing(false);
    }
  }, [localize, onLocalize]);
  
  if (/^en/i.test(getLocale())) {
    return null;
  }
  
  return (
    <View>
      {!translated && (
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
            <View row>
              <ActivityIndicator animating />
            </View>
          )
      )}
      {translated && (
        <Text
          caption 
          bold
          underline
          onPress={ () => {
            onToggleTranslate?.(!showTranslations);
            setShowTranslations((prev) => !prev);
          } }>
          {showTranslations ? strings.translate_showOriginalText : strings.translate_showTranslatedText}
        </Text>
      )}
    </View>
  );
}