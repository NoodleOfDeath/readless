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
  
  console.log(getSummariesById);
  
  const [bookmarkedSummaries, setBookmarkedSummaries] = React.useState<SummaryResponse[]>([]);
  const [pageSize, setPageSize] = React.useState(10);
  const [page, setPage] = React.useState(0);
  
  const [loading, setLoading] = React.useState(true);
  
  const summaryIds = React.useMemo(() => {
    return Object.entries(bookmarks)
      .filter(([k, v]) => /^summary:\d+$/.test(k) && v === true)
      .map(([k]) => Number.parseInt(k.split(':')[1]));
  });
  
  const loadBookmarks = React.useCallback(async (page = 0, pageSize = 10) => {
    if (page === 0) {
      setBookmarkedSummaries([]);
    }
    const { data, error } = await getSummariesById(summaryIds, {
      page,
      pageSize,
    });
    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }
    if (!data) {
      setLoading(false);
      return;
    }
    setBookmarkedSummaries((prev) => [...prev, ...data.rows]);
    setLoading(false);
  }, [bookmarks, page, pageSize]);
  
  React.useEffect(() => {
    loadBookmarks();
  }, [bookmarks]);
  
  const clearBookmarks = React.useCallback(() => {
    setPreference('bookmarks', {});
  }, [setPreference]);
  
  return (
    <SafeScrollView
      refreshing={ loading }
      onRefresh={ () => loadBookmarks(0) }>
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
          {bookmarkedSummaries.map((summary) => {
            return (
              <Text 
                key={ summary.id }
                mv={ 8 }>
                {summary.title}
              </Text>
            );
          })}
        </View>
      </View>
    </SafeScrollView>
  );
}
