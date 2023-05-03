import React from 'react';
import { Animated } from 'react-native';

import { Menu } from 'react-native-paper';
import {
  Circle,
  Path,
  Rect,
  Svg,
} from 'react-native-svg';

import { Sentiment } from '~/api';
import {
  Button,
  Divider,
  Icon,
  Text,
  View,
  ViewProps,
} from '~/components';
import { useStyles, useTheme } from '~/hooks';

export type MeterDialProps = {
  min?: number;
  max?: number;
  value?: number;
  majorTick?: number;
  minorTick?: number;
  meterStyle?: {
    stroke?: string;
    fill?: string;
  }
  needleStyle?: {
    stroke?: string;
    fill?: string;
  }
  width?: number;
  height?: number;
};

export function MeterDial({
  min = -1,
  max = 1,
  value = 0,
  majorTick = 0.2,
  minorTick = majorTick / 2,
  meterStyle = {
    fill: 'transparent',
    stroke: '#888',
  },
  needleStyle = {
    fill: '#ccc',
    stroke: '#888',
  },
  width = 200,
  height = width / 2,
}: MeterDialProps = {}) {
  const rotation = React.useMemo(() => {
    // x / -90 = v / min
    // x = -90v / min
    // x / 90 = v / max
    // x = 90v / max
    // x^2 = (-90v / min) * (90v / max)
    // x^2 = -810v^2/(min * max)
    // x = sqrt(-810v^2/(min*max))
    return value === 0 ? 0 : (value/Math.abs(value)) * Math.sqrt((-90 * value / min) * (90 * value / max));
  }, [min, max, value]);
  const majorTicks = React.useMemo(() => [...Array((max - min) / majorTick).keys()], [min, max, majorTick]);
  const minorTicks = React.useMemo(() => [...Array((max - min) / minorTick).keys()], [min, max, minorTick]);
  return (
    <Svg viewBox="0 0 100 60" width={ width } height={ height }>
      <Path 
        d="M90,50 a10,10 00 0,0 -80,0 Z"
        { ...meterStyle } />
      {majorTicks.map((k) => {
        return (
          <Path 
            key={ k }
            d="M50,10 L50,20"
            { ...meterStyle }
            transform={ `rotate(${(180 * k / majorTicks.length) - 90}, 50, 50)` } />
        );
      })}
      {minorTicks.map((k) => {
        return (
          <Path 
            key={ k }
            d="M50,10 L50,13"
            { ...meterStyle }
            transform={ `rotate(${(180 * k / minorTicks.length) - 90}, 50, 50)` } />
        );
      })}
      <Path 
        d="M50,50 L45,45 L50,0 L55,45 Z" 
        { ...needleStyle }
        transform={ `rotate(${rotation}, 50, 50)` } />
    </Svg>
  );
}

export type AnalyticsViewProps = Omit<ViewProps, 'children'> & {
  sentiments: Record<string, Sentiment>;
};

export function AnalyticsView({
  sentiments,
  ...props  
}: AnalyticsViewProps) {
  
  const style = useStyles(props);
  const theme = useTheme();
  
  const [showSentimentInfo, setShowSentimentInfo] = React.useState(false);
  
  const average = React.useMemo(() => {
    const scores = Object.values(sentiments).reduce((curr, prev) => curr + prev.score, 0);
    return scores / Object.values(sentiments).length;
  }, [sentiments]);
  
  const tokens = React.useMemo(() => {
    let tokens: Record<string, number> = {};
    Object.values(sentiments).forEach((s) => {
      tokens = { ...tokens, ...s.tokens };
    });
    return Object.entries(tokens).sort(([a], [b]) => a.toLowerCase() < b.toLowerCase() ? -1 : a.toLowerCase() > b.toLowerCase() ? 1 : 0);
  }, [sentiments]);
  
  const sentiment = React.useMemo(() => {
    if (average < -0.33333) {
      if (average < -0.66666) {
        return 'Very Negative';
      }
      return 'Negative';
    }
    if (average > 0.33333) {
      if (average > 0.66666) {
        return 'Very Positive';
      }
      return 'Positive';
    }
    return 'Neutral';
  }, [average]);
  
  return (
    <View style={ style }>
      <View col alignCenter gap={ 12 }>
        <View row gap={ 12 }>
          <Text>
            Sentiment Analysis
          </Text>
          <Menu
            contentStyle={ { 
              ...theme.components.card,
              borderRadius: 12,
              padding: 12,
              position: 'relative',
              top: 24,
              width: 200,
            } }
            visible={ showSentimentInfo }
            onDismiss={ () => setShowSentimentInfo(false) }
            anchor={
              <Button iconSize={ 24 } startIcon="information" onPress={ () => setShowSentimentInfo(true) } />
            }>
            <Text>Sentiment analysis is a tool that helps us understand how people feel about something by analyzing their language. It looks at the words people use and decides if they are positive, negative, or neutral. This can be useful in many areas, like understanding customer feedback or public opinion on a topic.</Text>
          </Menu>
        </View>
        <Text
          rounded
          bg={ /negative/i.test(sentiment) ? '#ff0000' : /positive/i.test(sentiment) ? '#00cc00' : '#222' }
          color="white"
          style={ { overflow: 'hidden' } }
          padding={ 6 }>
          { sentiment }
          {' '}
          (
          { average }
          )
        </Text>
        <View row alignCenter>
          <Icon 
            name="emoticon-sad"
            color="#ff0000"
            size={ 36 } />
          <MeterDial value={ average } />
          <Icon 
            name="emoticon-happy"
            color="#00cc00"
            size={ 36 } />
        </View>
      </View>
      <View>
        <Text>Notable Tokens</Text>
        {tokens.map(([key]) => (
          <Text key={ key }>
            •
            {key}
          </Text>
        ))}
      </View>
    </View>
  );
}