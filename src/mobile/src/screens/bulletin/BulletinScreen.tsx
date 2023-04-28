import React from 'react';

import {
  ActivityIndicator,
  Markdown,
  Screen,
  Text,
  View,
} from '~/components';
import { SessionContext } from '~/contexts';
import { useStatusClient, useTheme } from '~/hooks';
import { ScreenProps } from '~/screens';

export function BulletinScreen(_: ScreenProps<'default'>) {
  const theme = useTheme();
  const { 
    ready,
    preferences: { releases },
    setPreference,
  } = React.useContext(SessionContext);
  const { getReleases } = useStatusClient();

  const [loading, setLoading] = React.useState(false);
  const [releaseNotes, setReleaseNotes] = React.useState(Object.values(releases ?? {}));

  const onMount = React.useCallback(async () => {
    if (!ready) {
      return;
    }
    setLoading(true);
    const { data, error } = await getReleases();
    if (error) {
      console.error(error);
    }
    if (data) {
      setReleaseNotes([...data.rows].sort((a, b) => b.id - a.id));
      setPreference('releases', Object.fromEntries(data.rows.map((r) => [r.id, r])));
    }
    setLoading(false);
  }, [ready, getReleases, setPreference]);
  
  React.useEffect(
    () => {
      onMount(); 
    }, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ready]
  );

  return (
    <Screen
      refreshing={ loading }
      onRefresh={ () => onMount() }>
      <View mt={ 10 } mh={ 16 }>
        <Text textCenter bold>
          Come here for general updates, messages, and polls
        </Text>
        {loading && (
          <View alignCenter justifyCenter>
            <ActivityIndicator size="large" />
          </View>
        )}
        {!loading && releaseNotes.map((release) => (
          <View 
            key={ release.id }
            col
            outlined
            rounded
            p={ 8 }
            m={ 8 }
            mb={ 10 }>
            <Text h2 bold>{ release.version }</Text>
            <Text h4 bold>{ new Date(release.createdAt ?? '').toLocaleString() }</Text>
            { release.description.split('\n\n').map((p, i) => {
              return (
                <View 
                  key={ i }>
                  <Markdown
                    textStyles={ { color: theme.colors.text } }>
                    {p}
                  </Markdown>
                </View>
              );
            })}
          </View>
        ))}
      </View>
    </Screen>
  );
}
