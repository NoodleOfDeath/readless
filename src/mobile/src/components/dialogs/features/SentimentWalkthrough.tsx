import React from 'react';

import { SheetManager, SheetProps } from 'react-native-actions-sheet';

import {
  Button,
  Image,
  ScrollView,
  Summary,
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
      body: (
        <View alignCenter justifyCenter gap={ 12 }>
          <Text>
            Each article summary has a sentiment score. This is not shown by default to reduce clutter, but you may enable it if you find this measurement helpful in deciding whether, or not, an article is worth reading.
          </Text>
          <Image
            aspectRatio={ 1 }
            width={ 200 }
            source={ { uri: 'https://readless.nyc3.digitaloceanspaces.com/img/s/02df6070-0963-11ee-81c0-85b89936402b.jpg' } } />
          <Switch 
            value={ isEnabled }
            onValueChange={ (value) => {
              setIsEnabled(value);
              setPreference('sentimentEnabled', value);
            } }
            leftLabel={ 'Leave Off' }
            rightLabel={ 'Enable Sentiments' } />
        </View>
      ),
      title: 'Enable Sentiments?',
    },
  ], [isEnabled, setPreference]);
  
  const onDone = React.useCallback(async () => {
    setPreference('viewedFeatures', (prev) => {
      const state = { ...prev };
      state[props.sheetId] = new Bookmark(true);
      return (prev = state);
    });
    await SheetManager.hide(props.sheetId);
  }, [props.sheetId, setPreference]);

  return (
    <Walkthrough
      { ...props }
      payload={ { onDone, steps } } />
  );
}