import React from 'react';

import pluralize from 'pluralize';

import { PublicTokenAttributes, PublicTokenTypeAttributes } from '~/api';
import {
  Button,
  CollapsedView,
  ScrollView,
  ScrollViewProps,
  Text,
  View,
  ViewProps,
} from '~/components';
import { SessionContext } from '~/contexts';
import { 
  useNavigation,
  useStyles, 
  useSummaryClient,
  useTheme,
} from '~/hooks';
import { strings } from '~/locales';

export type TopicSamplerProps = ScrollViewProps & ViewProps & {
  initialTopicType?: Partial<PublicTokenTypeAttributes>;
  initialInterval?: string;
};

export function TopicSampler({
  initialTopicType = { displayName: 'Topic' },
  initialInterval = '24h',
  ...props
}: TopicSamplerProps) {
  
  const theme = useTheme();
  const style = useStyles(props);

  const { getTopicGroups, getTopics } = useSummaryClient();
  const { search } = useNavigation();
  const { ready } = React.useContext(SessionContext);
  
  const [_loading, setLoading] = React.useState(false);

  const [topicGroups, setTopicGroups] = React.useState<Partial<PublicTokenTypeAttributes>[]>([]);
  const [topicType, setTopicType] = React.useState(initialTopicType);
  const [topicInterval, _setTopicInterval] = React.useState(initialInterval);

  const [_topicCount, _setTopicCount] = React.useState(0);
  const [topics, setTopics] = React.useState<PublicTokenAttributes[]>([]);
  
  const title = React.useMemo(() => `${pluralize(topicType?.displayName || 'Topic')} ${strings.inTheLast} ${topicInterval}`, [topicType, topicInterval]);
  
  const onMount = React.useCallback(async () => {
    if (!ready) {
      return;
    }
    setLoading(true);
    const { data, error } = await getTopicGroups();
    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }
    if (data) {
      setTopicGroups([{ displayName: 'Topic' }, ...data.rows]);
    }
  }, [getTopicGroups, ready]);
  
  const loadTopics = React.useCallback(async () => {
    if (!ready) {
      return;
    }
    const { data, error } = await getTopics(topicType.name, topicInterval);
    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }
    if (data) {
      setTopics(data.rows);
    }
    setLoading(false);
  }, [getTopics, topicType, topicInterval, ready]);
    
  React.useEffect(() => {
    onMount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  React.useEffect(() => {
    loadTopics();
    const refreshInterval = setInterval(() => {
      loadTopics(); 
    }, 1000 * 60 * 5);
    return () => clearInterval(refreshInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, topicType, topicGroups]);
  
  return (
    <CollapsedView startCollapsed={ false } banner>
      <View
        height={ 100 } 
        ph={ 24 }
        gap={ 6 }
        style={ [theme.components.sampler, style] }>
        <Text textCenter subtitle1 capitalize bold>{title}</Text>
        {topics.length > 0 ? (
          <ScrollView horizontal style={ { overflow: 'visible' } }>
            <View row alignCenter mh={ 12 } gap={ 12 }>
              {topics.map((topic) => (
                <Button 
                  key={ topic.text }
                  elevated
                  p={ 2 }
                  onPress={ () => search({ prefilter: `"${topic.text.replace(/"/g, ($0) => `\\${$0}`)}"` }) }>
                  {topic.text}
                </Button>
              ))}
            </View>
          </ScrollView>
        ) : (
          <Text p={ 2 } textCenter>
            {strings.search.noResults}
            {' '}
            🥺
          </Text>
        )}
        <ScrollView horizontal style={ { overflow: 'visible' } }>
          <View row gap={ 12 }>
            {topicGroups.map((topicGroup) => (
              <Button
                key={ topicGroup.name ?? 'Topic' } 
                onPress={ () => setTopicType(topicGroup) }
                bold={ topicGroup.name === topicType?.name }
                underline={ topicGroup.name === topicType?.name }>
                {pluralize(topicGroup?.displayName ?? '')}
              </Button>
            ))}
          </View>
        </ScrollView>
      </View>
    </CollapsedView>
  );
}