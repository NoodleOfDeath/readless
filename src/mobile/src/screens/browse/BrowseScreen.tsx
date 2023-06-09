import React from 'react';
import { DeviceEventEmitter } from 'react-native';

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
  SegmentedButtons,
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
import { lengthOf } from '~/utils';

export function BrowseScreen({ navigation }: ScreenProps<'default'>) {

  const theme = useTheme();
  const { openCategory, openOutlet } = useNavigation();
  const { getCategories, getOutlets } = useCategoryClient();
  const {
    bookmarkedOutlets,
    bookmarkedCategories,
    followOutlet,
    followCategory,
    setPreference,
  } = React.useContext(SessionContext);
  
  const [activeTab, setActiveTab] = React.useState(0);
  const [filterCount, setFilterCount] = React.useState(lengthOf(bookmarkedOutlets, bookmarkedCategories));

  const [categories, setCategories] = React.useState<PublicCategoryAttributes[]>([]);
  const [outlets, setOutlets] = React.useState<PublicOutletAttributes[]>([]);
  const [_error, setError] = React.useState<InternalError>();
  
  const categoryCount = React.useMemo(() => Object.values(bookmarkedCategories ?? {}).length, [bookmarkedCategories]);
  const outletCount = React.useMemo(() => Object.values(bookmarkedOutlets ?? {}).length, [bookmarkedOutlets]);
  
  const buttons = React.useMemo(() => [
    { label: categories.length === 0 ? <ActivityIndicator animating size={ 24 } color="#888" /> : `${strings.categories} (${categoryCount === 0 ? categories.length : categoryCount}/${categories.length})`, value: 0 },
    { label: outlets.length === 0 ? <ActivityIndicator animating size={ 24 } color="#888" /> : `${strings.channels} (${outletCount === 0 ? outlets.length : outletCount}/${outlets.length})`, value: 1 },
  ], [categoryCount, categories.length, outletCount, outlets.length]);

  const loadCategories = React.useCallback(async () => {
    setError(undefined);
    const { data, error } = await getCategories();
    if (error) {
      setError(error);
      return;
    }
    if (!data) {
      setError(new ClientError('UNKNOWN'));
      return;
    }
    setCategories(data.rows);
  }, [getCategories]);

  const loadOutlets = React.useCallback(async () => {
    setError(undefined);
    const { data, error } = await getOutlets();
    if (error) {
      setError(error);
      return;
    }
    if (!data) {
      setError(new ClientError('UNKNOWN'));
      return;
    }
    setOutlets(data.rows);
  }, [getOutlets]);

  React.useEffect(() => {
    navigation?.setOptions({ headerRight: () => undefined });
    loadCategories();
    loadOutlets();
  }, [navigation, loadCategories, loadOutlets]);
  
  const clearBookmarks = React.useCallback((key: 'bookmarkedCategories' | 'bookmarkedOutlets') => {
    setPreference(key, {});
  }, [setPreference]);

  const autoApplyFilter = React.useCallback(() => {
    const value = lengthOf(bookmarkedOutlets, bookmarkedCategories);
    if (filterCount !== value && value > 0) {
      DeviceEventEmitter.emit('apply-filter', true);
      setPreference('showOnlyCustomNews', true);
    }
    setFilterCount(value);
  }, [bookmarkedOutlets, bookmarkedCategories, filterCount, setPreference]);

  React.useEffect(() => {
    autoApplyFilter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookmarkedOutlets, bookmarkedCategories]);

  return (
    <Screen>
      <ScrollView col mb={ 16 }>
        <View gap={ 12 }>
          <SegmentedButtons 
            value={ activeTab }
            onValueChange={ setActiveTab }
            buttons={ buttons } />
          {activeTab === 0 && (
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
          )}
          {activeTab === 1 && (
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
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}