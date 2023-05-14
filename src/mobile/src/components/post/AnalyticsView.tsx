import React from 'react';

import { SummarySentimentAttributes } from '~/api';
import {
  CollapsedView,
  Icon,
  Menu,
  MeterDial,
  Text,
  View,
  ViewProps,
} from '~/components';
import { useStyles } from '~/hooks';
import { averageOfSentiments } from '~/utils';

export type AnalyticsViewProps = Omit<ViewProps, 'children'> & {
  sentiments: SummarySentimentAttributes[] | { [key: string]: SummarySentimentAttributes };
};

export function AnalyticsView({
  sentiments,
  ...props  
}: AnalyticsViewProps) {
  
  const style = useStyles(props);
  
  const { score: average, tokens } = React.useMemo(() => averageOfSentiments(sentiments), [sentiments]);

  const sentiment = React.useMemo(() => {
    if (average < -0.2) {
      if (average < -0.6) {
        return 'Very Negative';
      }
      return 'Negative';
    }
    if (average > 0.2) {
      if (average > 0.6) {
        return 'Very Positive';
      }
      return 'Positive';
    }
    return 'Neutral';
  }, [average]);
  
  return (
    <View style={ style } gap={ 12 }>
      <CollapsedView
        title={ (
          <View row gap={ 12 }>
            <Text>
              Sentiment Analysis
            </Text>
            <Menu
              autoAnchor={
                <Icon size={ 24 } name="information" />
              }>
              <Text>Sentiment analysis is a tool that helps us understand how people feel about something by analyzing their language. It looks at the words people use and decides if they are positive, negative, or neutral. This can be useful in many areas, like understanding customer feedback or public opinion on a topic.</Text>
            </Menu>
          </View>
        ) }>
        <View col alignStart gap={ 12 }>
          <Text
            rounded
            bg={ /negative/i.test(sentiment) ? '#ff0000' : /positive/i.test(sentiment) ? '#00cc00' : '#888' }
            color="white"
            style={ { overflow: 'hidden' } }
            p={ 6 }>
            {`${ sentiment } ${average.toFixed(2)}`}
          </Text>
          <View row>
            <Icon 
              name="emoticon-sad"
              color="#ff0000"
              size={ 36 } />
            <MeterDial width={ 80 } value={ average } />
            <Icon 
              name="emoticon-happy"
              color="#00cc00"
              size={ 36 } />
          </View>
        </View>
      </CollapsedView>
      <CollapsedView
        title={ (
          <View row gap={ 12 } alignCenter>
            <Text>
              Notable Tokens
            </Text>
            <Menu
              autoAnchor={
                <Icon size={ 24 } name="information" />
              }>
              <Text>Sentiment is typically measured by counting the number of negative and positive words (tokens) in a certain text. This gives the reader an idea of the general tone of an article before even needing to read it.</Text>
            </Menu>
          </View>
        ) }>
        <View col>
          {tokens.map((key) => (
            <Text key={ key }>
              {`• ${key}`}
            </Text>
          ))}
        </View>
      </CollapsedView>
    </View>
  );
}