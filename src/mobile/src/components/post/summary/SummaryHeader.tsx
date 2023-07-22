import React from 'react';

import {
  ComputedSummaryProps,
  MeterDial,
  Popover,
  PublisherChip,
  Text,
  View,
} from '~/components';
import { useTheme } from '~/hooks';
import { getFnsLocale, strings } from '~/locales';
import { fixedSentiment, formatTimestamp } from '~/utils';

export type SummaryHeaderProps = ComputedSummaryProps;

export function SummaryHeader({
  publisher,
  originalDate,
  sentiment,
  forceSentiment,
  dateFormat,
  lastTick,
  disableInteractions,
  disableNavigation,
  ...props
}: SummaryHeaderProps) {

  const theme = useTheme();
  
  return (
    <View 
      { ...props }
      p={ 6 }
      flexGrow={ 1 }
      bg={ theme.colors.headerBackground }>
      <View flexRow itemsCenter gap={ 6 }>
        <PublisherChip 
          disabled={ disableNavigation }
          publisher={ publisher } />
        <Text
          caption
          color={ theme.colors.textSecondary }>
          •
        </Text>
        <Text  
          color={ theme.colors.textSecondary }
          textCenter
          caption>
          {formatTimestamp(originalDate, {
            format: dateFormat, locale: getFnsLocale(), relativeTo: lastTick, 
          })}
        </Text>
        <View row />
        {forceSentiment && (
          <Popover
            disabled={ disableInteractions }
            anchor={ (
              <View flexRow itemsCenter>
                <Text
                  subscript
                  adjustsFontSizeToFit>
                  { fixedSentiment(sentiment) }
                </Text>
                <MeterDial 
                  value={ sentiment }
                  width={ 30 } />
              </View>
            ) }>
            <Text p={ 20 }>
              {strings.summary_sentimentScore}
            </Text>
          </Popover>  
        )}
      </View>
    </View>
  );
}