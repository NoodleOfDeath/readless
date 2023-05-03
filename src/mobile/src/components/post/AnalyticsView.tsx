import React from 'react';

import {
  Circle,
  Path,
  Rect,
  Svg,
} from 'react-native-svg';

import { Sentiment } from '~/api';
import {
  Divider,
  Text,
  View,
  ViewProps,
} from '~/components';
import { useStyles } from '~/hooks';

export type AnalyticsViewProps = Omit<ViewProps, 'children'> & {
  sentiments: Record<string, Sentiment>;
};

export function AnalyticsView({
  sentiments,
  ...props  
}: AnalyticsViewProps) {
  
  const style = useStyles(props);
  
  const average = React.useMemo(() => {
    const scores = Object.values(sentiments).reduce((curr, prev) => curr + prev.score, 0);
    return scores / Object.values(sentiments).length;
  }, [sentiments]);
  
  return (
    <View style={ style }>
      <View col justifyCenter>
        <View>
          <View row gap={ 6 } alignCenter>
            <Text subtitle1>Analytics</Text>
            <View 
              bg={ 'red' }
              p={ 3 }
              rounded>
              <Text
                color="white">
                beta
              </Text>
            </View>
          </View>
        </View>
        <Divider />
        <Svg width="100%" viewBox="0 0 100 50" style={ { aspectRatio: 1.5, backgroundColor: '#aaa' } }>
          <Path d="M100,50 a50,50 0 0,0 -100,0" stroke="#000000" strokeWidth="1" />
        </Svg>
        <Text>{ average }</Text>
      </View>
    </View>
  );
}