import React from 'react';

import { RecapAttributes } from '~/api';
import { Screen, Text } from '~/components';
import { useSummaryClient } from '~/core';

export function RecapScreen() {
  const { getRecaps } = useSummaryClient();

  const [recaps, setRecaps] = React.useState<RecapAttributes[]>([]);

  const onMount = React.useCallback(async () => {
    try {
      const { data: recaps } = await getRecaps();
      if (!recaps) {
        return;
      }
      setRecaps(recaps.rows);
    } catch (error) {
      console.log(error);
    }
  }, [getRecaps]);

  React.useEffect(() => {
    onMount();
  }, [onMount]);

  return (
    <Screen>
      <Text>{JSON.stringify(recaps)}</Text>
    </Screen>
  );
}