import React from 'react';

import { SheetManager, SheetProps } from 'react-native-actions-sheet';

import {
  Button,
  Divider,
  Icon,
  Markdown,
  Pulse,
  ScrollView,
  Summary,
  View,
  Walkthrough,
} from '~/components';
import { Bookmark, SessionContext } from '~/core';
import { strings } from '~/locales';

export function SharingWalkthrough(props: SheetProps) {
  
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
        <View gap={ 12 }>
          <Markdown subtitle1 textCenter contained system>
            {strings.walkthroughs_sharing_shareArticles}
          </Markdown>
          <View
            absolute
            top={ 130 }
            right={ 130 }
            zIndex={ 20 }>
            <Pulse>
              <Icon name="cursor-pointer" size={ 120 } />
            </Pulse>
          </View>
          <ScrollView scrollEnabled={ false }>
            <Summary disableInteractions />
          </ScrollView>
          <View height={ 50 } />
          <Divider />
          <View itemsCenter>
            <Button
              contained
              system
              onPress={ onDone }>
              {strings.misc_duhIAlreadyKnow}
            </Button>
          </View>
        </View>
      ),
      title: strings.walkthroughs_sharing_noteworthyArticle,
    },
  ], [onDone]);

  return (
    <Walkthrough
      { ...props }
      payload={ { onDone, steps } } />
  );
}