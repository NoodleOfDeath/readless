import React from 'react';
import { DeviceEventEmitter } from 'react-native';

import {
  InternalError,
  PublicCategoryAttributes,
  PublicPublisherAttributes,
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
  const { openCategory, openPublisher } = useNavigation();
  const { getCategories, getPublishers } = useCategoryClient();
  const {
    followedPublishers,
    followedCategories,
    followPublisher,
    followCategory,
    setPreference,
  } = React.useContext(SessionContext);
  
  const [activeTab, setActiveTab] = React.useState(0);
  const [filterCount, setFilterCount] = React.useState(lengthOf(followedPublishers, followedCategories));

  const [publishers, setPublishers] = React.useState<PublicPublisherAttributes[]>([]);
  const [categories, setCategories] = React.useState<PublicCategoryAttributes[]>([]);
  const [selectedPublishers, setSelectedPublishers] = React.useState(followedPublishers);
  const [selectedCategories, setSelectedCategories] = React.useState(followedCategories);
  
  const [_error, setError] = React.useState<InternalError>();
  
  const buttons = React.useMemo(() => [
    { label: categories.length === 0 ? <ActivityIndicator animating size={ 24 } color="#888" /> : strings.misc_categories, value: 0 },
    { label: publishers.length === 0 ? <ActivityIndicator animating size={ 24 } color="#888" /> : strings.misc_channels, value: 1 },
  ], [categories.length, publishers.length]);

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

  const loadPublishers = React.useCallback(async () => {
    setError(undefined);
    const { data, error } = await getPublishers();
    if (error) {
      setError(error);
      return;
    }
    if (!data) {
      setError(new ClientError('UNKNOWN'));
      return;
    }
    setPublishers(data.rows);
  }, [getPublishers]);

  React.useEffect(() => {
    navigation?.setOptions({ headerRight: () => undefined });
    loadCategories();
    loadPublishers();
  }, [navigation, loadCategories, loadPublishers]);
  
  const clearBookmarks = React.useCallback((key: 'followedCategories' | 'followedPublishers') => {
    setPreference(key, {});
  }, [setPreference]);

  const autoApplyFilter = React.useCallback(() => {
    const value = lengthOf(followedPublishers, followedCategories);
    if (filterCount !== value && value > 0) {
      DeviceEventEmitter.emit('apply-filter', true);
      setPreference('showOnlyCustomNews', true);
    }
    setFilterCount(value);
  }, [followedPublishers, followedCategories, filterCount, setPreference]);

  React.useEffect(() => {
    autoApplyFilter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [followedPublishers, followedCategories]);

  return (
    <Screen>
      <ScrollView>
        <View gap={ 12 }>
          <SegmentedButtons 
            buttonProps={ { padding: 8 } }
            initialValue={ activeTab }
            onValueChange={ (value) => setActiveTab(value as number) }
            options={ buttons } />
          {activeTab === 0 && (
            <View col height='100%' mx={ 16 } gap={ 8 }>
              <View row>
                <View row />
                <Button 
                  elevated
                  selectable
                  itemsCenter
                  rounded
                  gap={ 8 }
                  p={ 8 }
                  onPress={ () => clearBookmarks('followedCategories') }>
                  {strings.action_clearSelection}
                </Button>
              </View>
              {categories.map((category, i) => (
                <View 
                  key={ category.name }
                  row
                  itemsCenter
                  rounded
                  bg={ i % 2 === 0 ? theme.colors.rowEven : theme.colors.rowOdd }>
                  <Button 
                    row
                    elevated
                    selectable
                    itemsCenter
                    rounded
                    gap={ 8 }
                    leftIcon={ category.icon }
                    p={ 8 }
                    onPress={ () => openCategory(category) }>
                    {category.displayName}
                  </Button>
                  <View row />
                  <Button
                    row
                    itemsCenter
                    rounded
                    gap={ 8 }
                    p={ 8 }
                    elevated
                    leftIcon={ selectedCategories?.[category.name] ? 'check' : undefined }
                    haptic
                    onPress={ () => {
                      setSelectedCategories((prev) => {
                        const state = { ...prev };
                        if (category.name in state) {
                          delete state[category.name];
                        } else {
                          state[category.name] = true;
                        }
                        return (prev = state);
                      });
                      followCategory(category);
                    } }>
                    {selectedCategories?.[category.name] ? strings.action_unfollow : strings.action_follow}
                  </Button>
                </View>
              ))}
            </View>
          )}
          {activeTab === 1 && (
            <View col mx={ 16 } gap={ 8 }>
              <View row>
                <View row />
                <View>
                  <Button
                    elevated
                    selectable
                    itemsCenter
                    rounded
                    gap={ 8 }
                    p={ 8 }
                    onPress={ ()=> clearBookmarks('followedPublishers') }>
                    {strings.action_clearSelection}
                  </Button>
                </View>
              </View>
              {publishers.map((publisher, i) => (
                <View 
                  key={ publisher.name }
                  row
                  itemsCenter
                  rounded
                  bg={ i % 2 === 0 ? theme.colors.rowEven : theme.colors.rowOdd }>
                  <Button 
                    row
                    elevated
                    selectable
                    itemsCenter
                    rounded
                    gap={ 8 }
                    p={ 8 }
                    onPress={ () => openPublisher(publisher) }>
                    {publisher.displayName}
                  </Button>
                  <View row />
                  <Button
                    row
                    itemsCenter
                    rounded
                    gap={ 8 }
                    p={ 8 }
                    elevated
                    leftIcon={ selectedPublishers?.[publisher.name] ? 'check' : undefined }
                    haptic
                    onPress={ () => {
                      setSelectedPublishers((prev) => {
                        const state = { ...prev };
                        if (publisher.name in state) {
                          delete state[publisher.name];
                        } else {
                          state[publisher.name] = true;
                        }
                        return (prev = state);
                      });
                      followPublisher(publisher);
                    } }>
                    {selectedPublishers?.[publisher.name] ? strings.action_unfollow : strings.action_follow}
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