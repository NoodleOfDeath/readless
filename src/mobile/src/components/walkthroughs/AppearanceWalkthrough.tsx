import React from 'react';

import { SheetManager, SheetProps } from 'react-native-actions-sheet';

import { ReadingFormat } from '~/api';
import { 
  CompactModePicker,
  DisplayModePicker,
  FontPicker,
  FontSizePicker,
  Markdown,
  ScrollView,
  Summary,
  View,
  Walkthrough,
} from '~/components';
import { Bookmark, SessionContext } from '~/contexts';
import { strings } from '~/locales';

export function AppearanceWalkthrough(props: SheetProps) {
  
  const { setPreference } = React.useContext(SessionContext);
  
  const steps = React.useMemo(() => {
    return [
      {
        body: (
          <View alignCenter justifyCenter gap={ 12 }>
            <ScrollView scrollEnabled={ false }>
              <Summary disableInteractions />
            </ScrollView>
            <FontPicker horizontal />
            <FontSizePicker />
          </View>
        ),
        title: strings.walkthroughs_appearance_selectFont,
      },
      {
        body: (
          <View gap={ 12 }>
            <ScrollView scrollEnabled={ false }>
              <Summary disableInteractions />
            </ScrollView>
            <CompactModePicker labeled />
          </View>
        ),
        title: strings.walkthroughs_appearance_compactModeDescription,
      },
      {
        body: (
          <View gap={ 12 }>
            <Markdown subtitle1 textCenter>
              {strings.walkthroughs_appearance_preferredReadingFormatDescription}
            </Markdown>
            <ScrollView scrollEnabled={ false }>
              <Summary 
                hideAnalytics
                hideCard
                initialFormat={ ReadingFormat.Summary }
                onFormatChange={ (format) => setPreference('preferredReadingFormat', format) } />
            </ScrollView>
          </View>
        ),
        title: strings.walkthroughs_appearance_preferredReadingFormat,
      },
      {
        body: (
          <View gap={ 12 }>
            <ScrollView scrollEnabled={ false }>
              <Summary disableInteractions />
            </ScrollView>
            <DisplayModePicker />
          </View>
        ),
        title: strings.walkthroughs_appearance_selectTheme,
      },
    ];
  }, [setPreference]);
  
  const onDone = React.useCallback(async () => {
    setPreference('viewedFeatures', (prev) => {
      const state = { ...prev };
      state[props.sheetId] = new Bookmark(true);
      return (prev = state);
    });
    await SheetManager.hide(props.sheetId);
  }, [props.sheetId, setPreference]);
  
  return (
    <Walkthrough
      { ...props }
      payload={ { onDone, steps } } />
  );
  
}