import React from 'react';

import { SheetManager, SheetProps } from 'react-native-actions-sheet';
import { Ellipse, Svg } from 'react-native-svg';

import {
  Button,
  Divider,
  Markdown,
  Pulse,
  ScrollView,
  Summary,
  View,
  Walkthrough,
} from '~/components';
import { Bookmark, SessionContext } from '~/core';
import { useTheme } from '~/hooks';
import { strings } from '~/locales';

export function SharingWalkthrough(props: SheetProps) {
  
  const theme = useTheme();
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
          <ScrollView scrollEnabled={ false }>
            <View
              absolute
              bottom={ 0 }
              right={ -10 }
              zIndex={ 20 }>
              <Pulse>
                <Svg 
                  viewBox="0 0 100 100"
                  width={ 150 }
                  height={ 60 }>
                  <Ellipse
                    cx={ 50 }
                    cy={ 50 }
                    rx={ 35 }
                    ry={ 35 }
                    fill="transparent"
                    stroke={ theme.colors.text }
                    strokeWidth={ 5 } />
                </Svg>
              </Pulse>
            </View>
            <Summary disableInteractions />
          </ScrollView>
          <Divider />
          <Markdown textCenter contained system>
            {strings.walkthroughs_sharing_shareArticlesDescription}
          </Markdown>
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
  ], [onDone, theme.colors.text]);

  return (
    <Walkthrough
      { ...props }
      payload={ { onDone, steps } } />
  );
}