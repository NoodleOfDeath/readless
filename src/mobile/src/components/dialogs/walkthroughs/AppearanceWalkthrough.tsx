import React from 'react';

import { SheetManager, SheetProps } from 'react-native-actions-sheet';

import { ReadingFormat } from '~/api';
import { 
  CompactModeSelector,
  DisplayModeSelector,
  FontSelector,
  FontSizeSelector,
  Image,
  ReadingFormatSelector,
  Summary,
  Text,
  View,
  Walkthrough,
} from '~/components';
import {
  Bookmark,
  LayoutContext,
  SessionContext,
} from '~/contexts';
import { strings } from '~/locales';

export function AppearanceWalkthrough(props: SheetProps) {
  
  const { orientation } = React.useContext(LayoutContext);
  const { setPreference } = React.useContext(SessionContext);
  
  const steps = React.useMemo(() => {
    return [
      {
        actions: (
          <View gap={ 12 }>
            <Text textCenter>Select a font and size that is easiest to read</Text>
            <FontSelector />
            <FontSizeSelector />
          </View>
        ),
        body: <Summary />,
        title: strings.settings.font,
      },
      {
        actions: (
          <View gap={ 12 }>
            <Text textCenter>
              By default, summaries will appear in expanded mode with a short title. You have the option to display additional short summaries under each title in expanded mode, or instead of the title in compact mode.
            </Text>
            <CompactModeSelector />
          </View>
        ),
        body: <Summary />,
        title: strings.settings.compactMode ?? 'Compact Mode',
      },
      {
        actions: (
          <View>
            <Text textCenter>
              Tap above to select the one you prefer, then press next.
            </Text>
          </View>
        ),
        body: <Summary 
          hideAnalytics
          hideCard
          initialFormat={ ReadingFormat.Summary }
          onFormatChange={ (format) => setPreferencd('preferredReadingFormat', format) } />,
        title: strings.settings.preferredReadingFormat ?? 'Summary or Bullets?',
      },
      {
        actions: (
          <View gap={ 12 }>
            <DisplayModeSelector />
          </View>
        ),
        body: <Summary />,
        title: 'Light or Dark Mode?',
      },
    ];
  }, [orientation, setPreference]);
  
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