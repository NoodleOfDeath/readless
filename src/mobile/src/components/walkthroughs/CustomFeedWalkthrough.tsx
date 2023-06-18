import React from 'react';

import { useKeyboardBottomInset } from 'native-base';
import { SheetManager, SheetProps } from 'react-native-actions-sheet';

import {
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
  const offset = useKeyboardBottomInset();
  
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
        <View gap={ 12 }>
          <Markdown textCenter>
            Let&apos; get started by choosing any of the following categories that may interest you
          </Markdown>
          <CategoryPicker height={ offset > 0 ? 200 : 300 } />
        </View>
      ),
      title: strings.walkthroughs_onboarding_addCategories,
    },
    {
      body: (
        <View gap={ 12 }>
          <Markdown textCenter>
            Read Less pulls from over 80 reputable news sources. Do you have any favorites?
          </Markdown>
          <OutletPicker height={ offset > 0 ? 200 : 300 } />
        </View>
      ),
      title: strings.walkthroughs_onboarding_addNewsSources,
    },
  ], [offset]);
  
  return (
    <Walkthrough
      { ...props }
      payload={ {
        closable: true, onDone, steps, 
      } } />
  );
}