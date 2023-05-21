import React from 'react';

import { BarChart } from 'react-native-chart-kit';

import { PublicSummarySentimentAttributes } from '~/api';
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
import { fixedSentiment } from '~/utils';

export type AnalyticsViewProps = Omit<ViewProps, 'children'> & {
  sentiment: number;
  sentiments: PublicSummarySentimentAttributes[];
};

const chartConfig = {
  backgroundColor: '#ccc',
  color: (opacity = 1) => `rgba(255, 255, 146, ${opacity})`,
};

export function AnalyticsView({
  sentiment,
  sentiments,
  ...props  
}: AnalyticsViewProps) {
  
  const style = useStyles(props);

  const sentimentLabel = React.useMemo(() => {
    if (sentiment < -0.2) {
      if (sentiment < -0.6) {
        return 'Very Negative';
      }
      return 'Negative';
    }
    if (sentiment > 0.2) {
      if (sentiment > 0.6) {
        return 'Very Positive';
      }
      return 'Positive';
    }
    return 'Neutral';
  }, [sentiment]);
  
  const chartData = React.useMemo(() => {
    const sets = [...sentiments].sort((a, b) => a.method.localeCompare(b.method));
    const data = {
      datasets: [{
        color: (opacity = 1) => {
          return `rgba(255, 255, 146, ${opacity})`;
        },
        data: sets.map((s) => Number(s.score.toFixed(2))),
      }],
      labels: sets.map((s) => s.method),
    };
    return data;
  }, [sentiments]);
  
  return (
    <View style={ style } gap={ 12 }>
      <CollapsedView
        startCollapsed={ false }
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
        <View gap={ 12 }>
          <View row alignStart gap={ 12 }>
            <Text
              bg={ /negative/i.test(sentimentLabel) ? '#ff0000' : /positive/i.test(sentimentLabel) ? '#00cc00' : '#888' }
              color="white"
              style={ { overflow: 'hidden' } }
              p={ 4 }>
              {`${ sentimentLabel } ${fixedSentiment(sentiment)}`}
            </Text>
            <MeterDial width={ 80 } value={ sentiment } />
          </View>
          <View>
            <View>
              <BarChart
                width={ 300 }
                height={ 200 }
                data={ chartData }
                fromZero
                showValuesOnTopOfBars
                chartConfig={ chartConfig }
                yAxisLabel=""
                yAxisSuffix="" />
            </View>
          </View>
        </View>
      </CollapsedView>
    </View>
  );
}