import React from 'react';

import { SheetManager, SheetProps } from 'react-native-actions-sheet';
import Svg, { Ellipse } from 'react-native-svg';

import {
  Button,
  CategoryPicker,
  Icon,
  Markdown,
  PublisherPicker,
  Pulse,
  Switch,
  View,
  Walkthrough,
} from '~/components';
import { SessionContext, TimelineEvent } from '~/contexts';
import { useTheme } from '~/hooks';
import { strings } from '~/locales';

export function CustomFeedWalkthrough(props: SheetProps) {
  
  const theme = useTheme();
  const { setStoredValue } = React.useContext(SessionContext);
  
  const [categories, setCategories] = React.useState<string[]>();
  const [publishers, setPublishers] = React.useState<string[]>();

  const saveChanges = React.useCallback(async () => {
    if (categories) {
      setStoredValue(
        'followedCategories', 
        Object.fromEntries(categories.map((category) => [category, true]))
      );
    }
    if (publishers) {
      setStoredValue(
        'followedPublishers', 
        Object.fromEntries(publishers.map((publisher) => [publisher, true]))
      );
    }
  }, [categories, publishers, setStoredValue]);

  const onDone = React.useCallback(async () => {
    setStoredValue('viewedFeatures', (prev) => {
      const state = { ...prev };
      state[props.sheetId] = new TimelineEvent(true);
      return (prev = state);
    });
    await SheetManager.hide(props.sheetId);
  }, [props.sheetId, setStoredValue]);
    
  const steps = React.useMemo(() => [
    {
      body: (
        <View gap={ 12 } mb={ 24 }>
          <Markdown subtitle1 textCenter system contained>
            {strings.walkthroughs_customFeed_letsStart}
          </Markdown>
          <CategoryPicker
            onValueChange={ setCategories }
            height={ 500 } />
        </View>
      ),
      title: strings.walkthroughs_customFeed_addCategories,
    },
    {
      body: (
        <View gap={ 12 } mb={ 24 }>
          <Markdown subtitle1 textCenter system contained>
            {strings.walkthroughs_customFeed_readlessPulls}
          </Markdown>
          <PublisherPicker 
            onValueChange={ setPublishers }
            height={ 500 } />
        </View>
      ),
      title: strings.walkthroughs_customFeed_addNewsSources,
    },
    {
      body: (
        <View gap={ 12 } itemsCenter>
          <View width="100%">
            <View
              absolute
              bottom={ 0 }
              left={ -10 }
              zIndex={ 20 }>
              <Pulse>
                <Svg 
                  viewBox="0 0 100 100"
                  width={ 150 }
                  height={ 60 }>
                  <Ellipse
                    cx={ 50 }
                    cy={ 50 }
                    rx={ 80 }
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
                beveled
                itemsCenter>
                <Icon name="filter" />
                <Switch />
                <Icon name="filter-off" />
              </View>
              <View row />
              <Icon name="menu" size={ 24 } />
            </View>
          </View>
          <Button
            h4
            system
            contained
            onPress={ onDone }>
            {strings.misc_sweetGotIt}
          </Button>
        </View>
      ),
      title: strings.walkthroughs_customFeed_toggleFilters,
    },
  ], [onDone, theme.colors.text]);
  
  return (
    <Walkthrough
      { ...props }
      payload={ {
        closable: true, 
        onClose: async () => await saveChanges(), 
        onDone, 
        steps,
      } } />
  );
}