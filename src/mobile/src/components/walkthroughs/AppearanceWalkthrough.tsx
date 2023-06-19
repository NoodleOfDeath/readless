import React from 'react';

import { SheetManager, SheetProps } from 'react-native-actions-sheet';

import { ReadingFormat } from '~/api';
import { 
  Button,
  ColorSchemePicker,
  CompactModePicker,
  FONT_SIZES,
  FontPicker,
  Markdown,
  NumericPrefPicker,
  PrefSwitch,
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
        body: (
          <View justifyCenter gap={ 12 }>
            <ScrollView scrollEnabled={ false }>
              <Summary disableInteractions />
            </ScrollView>
            <View itemsCenter gap={ 12 }>
              <FontPicker grid />
              <NumericPrefPicker
                prefKey='fontSizeOffset'
                offset={ FONT_SIZES.body1 }
                min={ -5 }
                max={ 5 }
                step={ 0.5 } />
            </View>
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
            <View alignCenter>
              <PrefSwitch prefKey="sourceLinks" />
            </View>
            <ScrollView scrollEnabled={ false }>
              <Summary disableInteractions />
            </ScrollView>
            <Markdown subtitle1 textCenter>
              {strings.walkthroughs_appearance_sourceLinksDescription}
            </Markdown>
            <Markdown textCenter>
              {strings.walkthroughs_appearance_youCanAlwaysSee}
            </Markdown>
          </View>
        ),
        title: strings.walkthroughs_appearance_sourceLinks,
      },
      {
        body: (
          <View gap={ 12 }>
            <ScrollView scrollEnabled={ false }>
              <Summary disableInteractions />
            </ScrollView>
            <View flexRow justifyCenter>
              <ColorSchemePicker buttons />
            </View>
            <View itemsCenter>
              <Button
                elevated
                onPress={ onDone }
                p={ 4 }
                rounded>
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