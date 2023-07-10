import React from 'react';

import { SheetManager, SheetProps } from 'react-native-actions-sheet';

import { ReadingFormat } from '~/api';
import { 
  Button,
  ColorSchemePicker,
  CompactModePicker,
  FONT_SIZES,
  FontPicker,
  NumericPrefPicker,
  ScrollView,
  Summary,
  View,
  Walkthrough,
} from '~/components';
import { Bookmark, SessionContext } from '~/contexts';
import { strings } from '~/locales';

export function AppearanceWalkthrough(props: SheetProps) {
  
  const { setPreference } = React.useContext(SessionContext);
  
  const onDone = React.useCallback(async () => {
    setPreference('viewedFeatures', (prev) => {
      const state = { ...prev };
      state[props.sheetId] = new Bookmark(true);
      return (prev = state);
    });
    await SheetManager.hide(props.sheetId);
  }, [props.sheetId, setPreference]);
  
  const steps = React.useMemo(() => {
    return [
      {
        artwork:( 
          <ScrollView scrollEnabled={ false }>
            <Summary
              disableInteractions
              disableNavigation />
          </ScrollView>
        ),
        artworkBelow: true,
        body: (
          <View itemsCenter gap={ 12 }>
            <FontPicker grid />
            <NumericPrefPicker
              prefKey='fontSizeOffset'
              offset={ FONT_SIZES.body1 }
              min={ -5 }
              max={ 5 }
              step={ 0.5 } />
          </View>
        ),
        title: strings.walkthroughs_appearance_selectFont,
      },
      {
        artwork:( 
          <ScrollView scrollEnabled={ false }>
            <Summary
              disableInteractions
              disableNavigation />
          </ScrollView>
        ),
        artworkBelow: true,
        body: (
          <View gap={ 12 }>
            <CompactModePicker labeled />
          </View>
        ),
        title: strings.walkthroughs_appearance_compactSummariesDescription,
      },
      {
        body: (
          <View gap={ 12 }>
            <ScrollView scrollEnabled={ false }>
              <Summary 
                hideAnalytics
                hideCard
                scrollEnabled={ false }
                initialFormat={ ReadingFormat.Summary }
                onFormatChange={ (format) => setPreference('preferredReadingFormat', format) } />
            </ScrollView>
          </View>
        ),
        title: strings.walkthroughs_appearance_preferredReadingFormat,
      },
      {
        artwork:( 
          <ScrollView scrollEnabled={ false }>
            <Summary
              disableInteractions
              disableNavigation />
          </ScrollView>
        ),
        artworkBelow: true,
        body: (
          <View gap={ 24 }>
            <View flexRow justifyCenter>
              <ColorSchemePicker buttons />
            </View>
            <View itemsCenter>
              <Button
                h4
                system
                contained
                onPress={ onDone }>
                {strings.action_allDone}
              </Button>
            </View>
          </View>
        ),
        title: strings.walkthroughs_appearance_selectTheme,
      },
    ];
  }, [onDone, setPreference]);
  
  return (
    <Walkthrough
      { ...props }
      payload={ {
        closable: true, onDone, steps, 
      } } />
  );
  
}