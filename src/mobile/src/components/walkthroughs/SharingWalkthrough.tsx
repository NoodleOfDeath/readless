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
import { DatedEvent, StorageContext } from '~/core';
import { strings } from '~/locales';

export function SharingWalkthrough(props: SheetProps) {
  
  const { setStoredValue } = React.useContext(StorageContext);

  const onDone = React.useCallback(async () => {
    setStoredValue('viewedFeatures', (prev) => {
      const state = { ...prev };
      state[props.sheetId] = new DatedEvent(true);
      return (prev = state);
    });
    await SheetManager.hide(props.sheetId);
  }, [props.sheetId, setStoredValue]);
  
  const steps = React.useMemo(() => [
    {
      body: (
        <View gap={ 12 }>
          <Markdown subtitle1 textCenter contained system>
            {strings.shareArticles}
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
            <Summary
              disableInteractions
              disableNavigation />
          </ScrollView>
          <View height={ 50 } />
          <Divider />
          <View itemsCenter>
            <Button
              contained
              system
              onPress={ onDone }>
              {strings.duhIAlreadyKnow}
            </Button>
          </View>
        </View>
      ),
      title: strings.noteworthyArticle,
    },
  ], [onDone]);

  return (
    <Walkthrough
      { ...props }
      payload={ { onDone, steps } } />
  );
}