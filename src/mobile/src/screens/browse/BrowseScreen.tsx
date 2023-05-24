import React from 'react';

import {
  InternalError,
  PublicCategoryAttributes,
  PublicOutletAttributes,
} from '~/api';
import {
  ActivityIndicator,
  Button,
  Screen,
  ScrollView,
  TabSwitcher,
  TopicSampler,
  View,
} from '~/components';
import {  SessionContext } from '~/contexts';
import {
  ClientError,
  useCategoryClient,
  useNavigation,
  useTheme,
} from '~/hooks';
import { strings } from '~/locales';
import { ScreenProps } from '~/screens';

export function BrowseScreen(_props: ScreenProps<'default'>) {

  const theme = useTheme();
  const { openCategory, openOutlet } = useNavigation();
  const { getCategories, getOutlets } = useCategoryClient();
  const {
    followCategory,
    followOutlet,
    preferences: {
      bookmarkedCategories,
      bookmarkedOutlets,
    },
    setPreference,
  } = React.useContext(SessionContext);
  
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState(0);

  const [categories, setCategories] = React.useState<PublicCategoryAttributes[]>([]);
  const [outlets, setOutlets] = React.useState<PublicOutletAttributes[]>([]);
  const [_error, setError] = React.useState<InternalError>();
  
  const categoryCount = React.useMemo(() => Object.values(bookmarkedCategories ?? {}).length, [bookmarkedCategories]);
  const outletCount = React.useMemo(() => Object.values(bookmarkedOutlets ?? {}).length, [bookmarkedOutlets]);
  
  const titles = React.useMemo(() => [
    `${strings.categories} (${categoryCount === 0 ? categories.length : categoryCount}/${categories.length})`,
    `${strings.channels} (${outletCount === 0 ? outlets.length : outletCount}/${outlets.length})`,
  ], [categories, categoryCount, outlets, outletCount]);

  const loadCategories = React.useCallback(async () => {
    setError(undefined);
    const { data, error } = await getCategories();
    if (error) {
      setError(error);
      setLoading(false);
      return;
    }
    if (!data) {
      setError(new ClientError('UNKNOWN'));
      setLoading(false);
      return;
    }
    setCategories(data.rows);
    setLoading(false);
  }, [getCategories]);

  const loadOutlets = React.useCallback(async () => {
    setError(undefined);
    const { data, error } = await getOutlets();
    if (error) {
      setError(error);
      setLoading(false);
      return;
    }
    if (!data) {
      setError(new ClientError('UNKNOWN'));
      setLoading(false);
      return;
    }
    setOutlets(data.rows);
    setLoading(false);
  }, [getOutlets]);

  React.useEffect(() => {
    setLoading(true);
    loadCategories();
    loadOutlets();
  }, [loadCategories, loadOutlets]);
  
  const clearBookmarks = React.useCallback((key: 'bookmarkedCategories' | 'bookmarkedOutlets') => {
    setPreference(key, {});
  }, [setPreference]);

  return (
    <Screen
      refreshing={ loading }
      onRefresh={ () => activeTab === 0 ? loadCategories() : loadOutlets() }>
      {loading ? (<ActivityIndicator animating size={ 24 } />) : 
        (
          <ScrollView col mb={ 16 }>
            <TopicSampler horizontal />
            <TabSwitcher 
              tabHeight={ 48 }
              activeTab={ activeTab }
              onTabChange={ setActiveTab }
              titles={ titles }>
              <View col height='100%' mh={ 16 } gap={ 8 }>
                <View row>
                  <View row />
                  <Button 
                    elevated
                    selectable
                    alignCenter
                    rounded
                    gap={ 8 }
                    p={ 8 }
                    onPress={ () => clearBookmarks('bookmarkedCategories') }>
                    {strings.clearSelection}
                  </Button>
                </View>
                {categories.map((category, i) => (
                  <View 
                    key={ category.name }
                    row
                    alignCenter
                    rounded
                    bg={ i % 2 === 0 ? theme.colors.rowEven : theme.colors.rowOdd }>
                    <Button 
                      row
                      elevated
                      selectable
                      alignCenter
                      rounded
                      gap={ 8 }
                      startIcon={ category.icon }
                      p={ 8 }
                      onPress={ () => openCategory(category) }>
                      {category.displayName}
                    </Button>
                    <View row />
                    <Button
                      row
                      alignCenter
                      rounded
                      gap={ 8 }
                      p={ 8 }
                      elevated
                      startIcon={ bookmarkedCategories?.[category.name] ? 'check' : undefined }
                      onPress={ () => followCategory(category) }>
                      {bookmarkedCategories?.[category.name] ? strings.unfollow : strings.follow}
                    </Button>
                  </View>
                ))}
              </View>
              <View col mh={ 16 } gap={ 8 }>
                <View row>
                  <View row />
                  <View>
                    <Button
                      elevated
                      selectable
                      alignCenter
                      rounded
                      gap={ 8 }
                      p={ 8 }
                      onPress={ ()=> clearBookmarks('bookmarkedOutlets') }>
                      {strings.clearSelection}
                    </Button>
                  </View>
                </View>
                {outlets.map((outlet, i) => (
                  <View 
                    key={ outlet.name }
                    row
                    alignCenter
                    rounded
                    bg={ i % 2 === 0 ? theme.colors.rowEven : theme.colors.rowOdd }>
                    <Button 
                      row
                      elevated
                      selectable
                      alignCenter
                      rounded
                      gap={ 8 }
                      p={ 8 }
                      onPress={ () => openOutlet(outlet) }>
                      {outlet.displayName}
                    </Button>
                    <View row />
                    <Button
                      row
                      alignCenter
                      rounded
                      gap={ 8 }
                      p={ 8 }
                      elevated
                      startIcon={ bookmarkedOutlets?.[outlet.name] ? 'check' : undefined }
                      onPress={ () => followOutlet(outlet) }>
                      {bookmarkedOutlets?.[outlet.name] ? strings.unfollow : strings.follow}
                    </Button>
                  </View>
                ))}
              </View>
            </TabSwitcher>
          </ScrollView>
        )}
    </Screen>
  );
}