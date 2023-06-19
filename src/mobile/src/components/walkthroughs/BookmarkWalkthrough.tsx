import React from 'react';

import { SheetManager, SheetProps } from 'react-native-actions-sheet';
import Svg, { Ellipse } from 'react-native-svg';

import {
  Button,
  Divider,
  Icon,
  Markdown,
  Pulse,
  Switch,
  Text,
  View,
  Walkthrough,
} from '~/components';
import { Bookmark, SessionContext } from '~/core';
import { useTheme } from '~/hooks';
import { strings } from '~/locales';

export function BookmarkWalkthrough(props: SheetProps) {
  
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
        <View itemsCenter gap={ 12 }>
          <Markdown subtitle1 textCenter>{strings.walkthroughs_bookmark_niceJob}</Markdown>
          <View width="100%">
            <View
              absolute
              bottom={ 0 }
              right={ -55 }
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
            <View flexRow elevated p={ 8 } itemsCenter>
              <View 
                flexRow
                gap={ 6 }
                p={ 6 }
                rounded
                itemsCenter>
                <Icon name="filter" />
                <Switch />
                <Icon name="filter-off" />
              </View>
              <View row />
              <Icon name="menu" size={ 24 } />
            </View>
          </View>
          <Divider />
          <Text>{strings.walkthroughs_bookmark_happyReading}</Text>
          <Button
            elevated
            p={ 4 }
            rounded
            onPress={ onDone }>
            {strings.misc_awesome}
          </Button>
        </View>
      ),
      title: 'Where are my bookmarks?',
    },
  ], [onDone, theme]);

  return (
    <Walkthrough
      { ...props }
      payload={ { onDone, steps } } />
  );
}