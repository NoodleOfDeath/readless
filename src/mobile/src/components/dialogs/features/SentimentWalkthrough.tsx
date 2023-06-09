import React from 'react';

import { SheetManager, SheetProps } from 'react-native-actions-sheet';

import {
  Button,
  Image,
  Switch,
  Text,
  View,
  Walkthrough,
} from '~/components';
import { Bookmark, SessionContext } from '~/contexts';
import { strings } from '~/locales';

export function SentimentWalkthrough(props: SheetProps) {
  
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
    (
      <View
        key='1' 
        alignCenter 
        justifyCenter
        gap={ 12 }>
        <Text h5 bold>{strings.features.sentiment.sentiment}</Text>
        <Text>{strings.features.sentiment.description}</Text>
      </View>
    ),
    (
      <View
        key='2' 
        alignCenter 
        justifyCenter
        gap={ 12 }>
        <Text h5 bold textCenter>How Can Sentiment Be Measured?</Text>
        <Text>Sentiment can be measured in a number of ways. Read Less currently uses 3 sentiment measures. Two of these are statistically based, while the third is derived from a large language model. It is important to recognize the potential for predisposed biases when measuring sentiment, such as the openai sentiment scores we collect, which are sometimes skewed with a political bias.</Text>
      </View>
    ),
    (
      <View
        key='3' 
        alignCenter 
        justifyCenter>
        <Text>Turn Sentiments On?</Text>
        <Switch
          leftLabel={ 'Leave off' }
          rightLabel={ 'Turn on' } />
      </View>
    ),
  ], []);

  return (
    <Walkthrough
      { ...props }
      payload={ { onDone, steps } } />
  );
}