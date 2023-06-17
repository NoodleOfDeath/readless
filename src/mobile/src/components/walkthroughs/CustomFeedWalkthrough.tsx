import React from 'react';

import { SheetManager, SheetProps } from 'react-native-actions-sheet';

import {
  Button,
  CategoryPicker,
  Markdown,
  OutletPicker,
  View,
  Walkthrough,
} from '~/components';
import { Bookmark, SessionContext } from '~/contexts';
import { strings } from '~/locales';

export function CustomFeedWalkthrough(props: SheetProps) {
  
  const { setPreference } = React.useContext(SessionContext);
  
  const onDone = React.useCallback(async () => {
    setPreference('viewedFeatures', (prev) => {
      const state = { ...prev };
      state[props.sheetId] = new Bookmark(true);
      return (prev = state);
    });
    await SheetManager.hide(props.sheetId);
  }, [props.sheetId, setPreference]);
    
  const steps = React.useMemo(() => [
    {
      body: (
        <View>
          <Markdown textCenter>
            Let&apos; get started by choosing any of the follow categories that may interest you
          </Markdown>
          <CategoryPicker />
          <Button>Skip</Button>
        </View>
      ),
      title: strings.walkthroughs_onboarding_addCategories,
    },
    {
      body: (
        <View>
          <Markdown textCenter>
            Read Less pulls from over 80 reputable news sources. Do you have any favorites?
          </Markdown>
          <OutletPicker />
          <Button>Skip</Button>
        </View>
      ),
      title: strings.walkthroughs_onboarding_addNewsSources,
    },
  ], []);
  
  return (
    <Walkthrough
      { ...props }
      payload={ { onDone, steps } } />
  );
}