import React from 'react';

import { SummaryResponse } from '~/api';
import { 
  Button,
  SafeScrollView,
  Summary,
  Text,
  View,
} from '~/components';
import { AppStateContext, SessionContext } from '~/contexts';
import { useSummaryClient } from '~/hooks';

export function MyStuffScreen() {
  
  const { 
    preferences: { bookmarks },
    setPreference,
  } = React.useContext(SessionContext);
  const { getSummariesById } = useSummaryClient();
  
  const [bookmarkedSummaries, setBookmarkedSummaries] = React.useState<SummaryResponse[]>([]);
  const [pageSize, setPageSize] = React.useState(10);
  const [page, setPage] = React.useState(0);
  
  const [loading, setLoading] = React.useState(true);
  
  const summaries = React.useMemo(() => {
    return Object.entries(bookmarks)
      .filter(([k, v]) => /^summary:\d+$/.test(k) && v != null);
  });
  
  const clearBookmarks = React.useCallback(() => {
    setPreference('bookmarks', {});
  }, [setPreference]);
  
  return (
    <SafeScrollView>
      <View col p={ 32 }>
        <Button 
          rounded
          selectable
          p={ 8 }
          mb={ 8 }
          center
          onPress={ () => clearBookmarks() }>
          Clear Bookmarks
        </Button>
        <View>
          {summaries.map((summary) => {
            return (
              <Text key={ summary.id }>summ</Text>
            );
          })}
        </View>
      </View>
    </SafeScrollView>
  );
}
