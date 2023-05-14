import React from 'react';

import { PublicSummaryTokenAttributes, TokenType } from '~/api';
import {
  Button,
  CollapsedView,
  ScrollView,
  ScrollViewProps,
  Text,
  View,
} from '~/components';
import { SessionContext } from '~/contexts';
import { 
  useNavigation,
  useStyles, 
  useSummaryClient,
  useTheme,
} from '~/hooks';

type TokenToPlural = {
  value?: TokenType;
  plural: string;
};

const TOKEN_TYPES: TokenToPlural[] = [
  { plural: 'topics' },
  { plural: 'businesses', value: TokenType.Business },
  { plural: 'events', value: TokenType.Event },
  { plural: 'innovations', value: TokenType.Innovation },
  { plural: 'people', value: TokenType.Person },
  { plural: 'places', value: TokenType.Place },
];

export type TopicSamplerProps = ScrollViewProps & {
  initialType?: TokenToPlural;
  initialInterval?: string;
  initialPageSize?: number;
  min?: number;
};

export function TopicSampler({
  initialType,
  initialInterval = '12h',
  initialPageSize = 10,
  min = 0,
  ...props
}: TopicSamplerProps) {
  
  const theme = useTheme();
  const style = useStyles(props);

  const { getTrends } = useSummaryClient();
  const { search } = useNavigation();
  const { ready } = React.useContext(SessionContext);
  
  const [_loading, setLoading] = React.useState(false);
  const [page, _setPage] = React.useState(0);
  const [pageSize] = React.useState(initialPageSize);

  const [type, setTopicType] = React.useState(initialType);
  const [interval, _setTopicInterval] = React.useState(initialInterval);

  const [_topicCount, setTopicCount] = React.useState(0);
  const [topics, setTopics] = React.useState<PublicSummaryTokenAttributes[]>([]);
  
  const title = React.useMemo(() => `${type?.plural || 'topics'} trending in the last ${interval}`, [type, interval]);
  
  const onMount = React.useCallback(async () => {
    if (!ready) {
      return;
    }
    setLoading(true);
    const { data, error } = await getTrends(type?.value, interval, min, page, pageSize);
    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }
    if (data) {
      setTopicCount(data.count);
      setTopics(data.rows);
    }
    setLoading(false);
  }, [getTrends, type, interval, min, page, pageSize, ready]);
  
  React.useEffect(() => {
    onMount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  React.useEffect(() => {
    onMount();
    const refreshInterval = setInterval(() => {
      onMount(); 
    }, 1000 * 60 * 5);
    return () => clearInterval(refreshInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);
  
  return (
    <CollapsedView startCollapsed={ false } banner>
      <View
        height={ 140 } 
        ph={ 24 }
        pt={ 12 }
        gap={ 12 }
        style={ [theme.components.sampler, style] }>
        <Text textCenter subtitle1 capitalize bold>{title}</Text>
        <ScrollView horizontal style={ { overflow: 'visible' } }>
          <View row alignCenter mh={ 12 } gap={ 12 }>
            {topics.map((topic) => (
              <Button 
                key={ topic.text }
                elevated
                p={ 4 }
                onPress={ () => search({ prefilter: `"${topic.text.replace(/['"'$]/g, '')}"` }) }>
                {topic.text}
              </Button>
            ))}
          </View>
        </ScrollView>
        <ScrollView horizontal style={ { overflow: 'visible' } }>
          <View row gap={ 12 }>
            {TOKEN_TYPES.map((tokenType) => (
              <Button
                key={ tokenType.plural } 
                onPress={ () => setTopicType(tokenType) }
                bold={ tokenType.value === type?.value }
                underline={ tokenType.value === type?.value }>
                {tokenType.plural}
              </Button>
            ))}
          </View>
        </ScrollView>
      </View>
    </CollapsedView>
  );
}