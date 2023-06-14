import React from 'react';

import { SheetManager, SheetProps } from 'react-native-actions-sheet';

import {
  Button,
  Image,
  MeterDial,
  ScrollView,
  Switch,
  Text,
  View,
  Walkthrough,
  WalkthroughStep,
} from '~/components';
import { Bookmark, SessionContext } from '~/contexts';
import { strings } from '~/locales';

export function SentimentWalkthrough(props: SheetProps) {
  
  const { sentimentEnabled, setPreference } = React.useContext(SessionContext);

  const [isEnabled, setIsEnabled] = React.useState(sentimentEnabled);

  const onDone = React.useCallback(async () => {
    setPreference('viewedFeatures', (prev) => {
      const state = { ...prev };
      state[props.sheetId] = new Bookmark(true);
      return (prev = state);
    });
    await SheetManager.hide(props.sheetId);
  }, [props.sheetId, setPreference]);
  
  const steps: WalkthroughStep[] = React.useMemo(() => [
    {
      body: strings.features.sentiment.description,
      title: strings.features.sentiment.sentiment,
    },
    {
      body: 'Sentiment can be measured in a number of ways. Read Less currently uses 3 sentiment measures. Two of these are statistically based, while the third is derived from a large language model. It is important to recognize the potential for predisposed biases when measuring sentiment, such as the openai sentiment scores we collect, which are sometimes skewed with a political bias.',
      title: 'How Can Sentiment Be Measured?',
    },
    {
      actions: (
        <View alignCenter justifyCenter gap={ 12 }>
          <Text>
            Each article summary has a sentiment score. This is not shown by default to reduce clutter, but you may enable it if you find this measurement helpful in deciding whether, or not, an article is worth reading.
          </Text>
          <Button
            elevated
            rounded
            p={ 6 }
            m={ 3 }
            onPress={ () => {
              setPreference('sentimentEnabled', true);
              onDone();
            } }>
            Enable Sentiments
          </Button>
          <Button 
            elevated
            rounded
            p={ 6 }
            m={ 3 }
            onPress={ () => {
              onDone();
            } }>
            I&apos;m good for now.
          </Button>
        </View>
      ),
      body: <MeterDial value={ 0.3 } />,
      title: 'Enable Sentiments?',
    },
  ], [isEnabled, setPreference, onDone]);
  
  return (
    <Walkthrough
      { ...props }
      payload={ { onDone, steps } } />
  );
}