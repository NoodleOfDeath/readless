import React from 'react';

import { SheetManager, SheetProps } from 'react-native-actions-sheet';

import {
  Button,
  Divider,
  Markdown,
  MeterDial,
  ScrollView,
  Summary,
  Text,
  View,
  Walkthrough,
  WalkthroughStep,
} from '~/components';
import { Bookmark, SessionContext } from '~/contexts';
import { useInAppBrowser, useTheme } from '~/hooks';
import { strings } from '~/locales';

export function SentimentWalkthrough(props: SheetProps) {
  
  const { setPreference } = React.useContext(SessionContext);
  const { openURL } = useInAppBrowser();
  const theme = useTheme();

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
      body: (
        <View elevated p={ 12 }>
          <View flexRow flexWrap="wrap" alignCenter gap={ 3 }>
            <Text>&quot;I absolutely</Text>
            <Text bold underline color="green">loved</Text>
            <Text>the new movie, it was a</Text>
            <Text bold underline color="green">captivating</Text>
            <Text>and emotional experience.</Text>
            <Text>&quot;</Text>
          </View>
        </View>
      ),
      footer: strings.walkthroughs_sentiment_whatIsSentimentAnalysisDescription,
      title: strings.walkthroughs_sentiment_whatIsSentimentAnalysis,
    },
    {
      body: (
        <View gap={ 12 }>
          <Markdown>{strings.walkthroughs_sentiment_whatIsSentimentUsedForDescriptionP1}</Markdown>
          <View elevated p={ 12 }>
            <View flexRow flexWrap="wrap" alignCenter gap={ 3 }>
              <Text>&quot;</Text>
              <Text bold underline color="green">lol</Text>
              <Text>most news is really</Text>
              <Text bold underline color="red">sad</Text>
              <Text bold underline color="red">😡</Text>
              <Text>&quot;</Text>
            </View>
          </View>
          <Markdown>{strings.walkthroughs_sentiment_whatIsSentimentUsedForDescriptionP2}</Markdown>
        </View>
      ),
      title: strings.walkthroughs_sentiment_whatIsSentimentUsedFor,
    },
    {
      body: (
        <View alignCenter gap={ 12 }>
          <Text>{strings.walkthroughs_sentiment_howIsSentimetMeasuredDescription}</Text>
          <View alignCenter flexRow>
            <View alignCenter>
              <Text h4 color="red">-1</Text>
              <Text textCenter color="red">{strings.summary_veryNegative}</Text>
            </View>
            <MeterDial value={ 0.3 } />
            <View alignCenter>
              <Text h4 color="green">+1</Text>
              <Text textCenter color="green">{strings.summary_veryPositive}</Text>
            </View>
          </View>
          <View alignCenter>
            <Text h4>+0</Text>
            <Text textCenter>{strings.summary_neutral}</Text>
          </View>
        </View>
      ),
      title: strings.walkthroughs_sentiment_howIsSentimetMeasured,
    },
    {
      body: (
        <View alignCenter gap={ 12 }>
          <Markdown 
            highlightStyle={ {
              color: theme.colors.link, fontWeight: 'bold', textDecorationLine: 'underline', 
            } }
            onPress={ () => openURL('https://en.wikipedia.org/wiki/Lexical_analysis') }>
            {strings.walkthroughs_sentiment_howDoWeMeasureSentimentDescriptionP1}
          </Markdown>
          <View flexRow alignCenter gap={ 3 }>
            <Text 
              color="link"
              onPress={ () => openURL('http://corpustext.com/reference/sentiment_afinn.html') }
              underline
              bold>
              AFINN
            </Text>
            <Text>{strings.misc_and}</Text>
            <Text 
              color="link"
              onPress={ () => openURL('https://medium.com/@piocalderon/vader-sentiment-analysis-explained-f1c4f9101cd9#:~:text=VADER%20(Valence%20Aware%20Dictionary%20for,intensity%20(strength)%20of%20emotion.') }
              underline
              bold>
              VADER
            </Text>
          </View>
          <Text>
            {strings.walkthroughs_sentiment_howDoWeMeasureSentimentDescriptionP2}
          </Text>
          <Divider bg={ theme.colors.text } />
          <Markdown>
            {strings.walkthroughs_sentiment_howDoWeMeasureSentimentDescriptionP3}
          </Markdown>
        </View>
      ),
      title: strings.walkthroughs_sentiment_howDoWeMeasureSentiment,
    },
    {
      body: (
        <View alignCenter justifyCenter gap={ 12 }>
          <Text>
            {strings.walkthroughs_sentiment_score}
          </Text>
          <ScrollView scrollEnabled={ false }>
            <Summary forceSentiment disableInteractions />
          </ScrollView>
          <View flexRow alignCenter gap={ 3 }>
            <Button
              elevated
              rounded
              touchable
              haptic
              p={ 6 }
              m={ 3 }
              onPress={ () => {
                setPreference('sentimentEnabled', true);
                onDone();
              } }>
              {strings.walkthroughs_sentiment_enable}
            </Button>
            <Button 
              elevated
              rounded
              touchable
              haptic
              p={ 6 }
              m={ 3 }
              onPress={ () => {
                onDone();
              } }>
              {strings.walkthroughs_sentiment_dontEnable}
            </Button>
          </View>
        </View>
      ),
      title: strings.walkthroughs_sentiment_enableQuestion,
    },
  ], [theme.colors.link, theme.colors.text, openURL, setPreference, onDone]);
  
  return (
    <Walkthrough
      { ...props }
      payload={ { onDone, steps } } />
  );
}