import React from 'react';

import { SheetManager, SheetProps } from 'react-native-actions-sheet';
import Svg, { Ellipse } from 'react-native-svg';

import {
  Button,
  Divider,
  Header,
  Markdown,
  Pulse,
  SearchViewController,
  View,
  Walkthrough,
} from '~/components';
import { DatedEvent, StorageContext } from '~/core';
import { useTheme } from '~/hooks';
import { strings } from '~/locales';

export function BookmarkWalkthrough(props: SheetProps) {
  
  const theme = useTheme();
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
        <View itemsCenter gap={ 12 }>
          <Markdown subtitle1 textCenter system contained>{strings.niceJob}</Markdown>
          <View width="100%">
            <View
              absolute
              left={ -30 }
              top={ 5 }
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
            <View flexRow elevated p={ 8 } itemsCenter justifyEvenly>
              <Header menu flex={ 1 } flexRow flexGrow={ 1 }>
                <SearchViewController flexGrow={ 1 } />
              </Header>
            </View>
          </View>
          <Divider />
          <Markdown system subtitle1 contained>{strings.happyReading}</Markdown>
          <Button
            system
            contained
            h4
            onPress={ onDone }>
            {strings.awesome}
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