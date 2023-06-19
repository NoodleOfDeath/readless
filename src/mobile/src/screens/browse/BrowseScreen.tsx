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
    followedOutlets,
    followedCategories,
    followOutlet,
    followCategory,
    setPreference,
  } = React.useContext(SessionContext);
  
  const [activeTab, setActiveTab] = React.useState(0);
  const [filterCount, setFilterCount] = React.useState(lengthOf(followedOutlets, followedCategories));

  const [outlets, setOutlets] = React.useState<PublicOutletAttributes[]>([]);
  const [categories, setCategories] = React.useState<PublicCategoryAttributes[]>([]);
  const [selectedOutlets, setSelectedOutlets] = React.useState(followedOutlets);
  const [selectedCategories, setSelectedCategories] = React.useState(followedCategories);
  
  const [_error, setError] = React.useState<InternalError>();
  
  const buttons = React.useMemo(() => [
    { label: categories.length === 0 ? <ActivityIndicator animating size={ 24 } color="#888" /> : strings.misc_categories, value: 0 },
    { label: outlets.length === 0 ? <ActivityIndicator animating size={ 24 } color="#888" /> : strings.misc_channels, value: 1 },
  ], [categories.length, outlets.length]);

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
  
  const clearBookmarks = React.useCallback((key: 'followedCategories' | 'followedOutlets') => {
    setPreference(key, {});
  }, [setPreference]);

  const autoApplyFilter = React.useCallback(() => {
    const value = lengthOf(followedOutlets, followedCategories);
    if (filterCount !== value && value > 0) {
      DeviceEventEmitter.emit('apply-filter', true);
      setPreference('showOnlyCustomNews', true);
    }
    setFilterCount(value);
  }, [followedOutlets, followedCategories, filterCount, setPreference]);

  React.useEffect(() => {
    autoApplyFilter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [followedOutlets, followedCategories]);

  return (
    <Screen>
      <ScrollView>
        <View gap={ 12 }>
          <SegmentedButtons 
            initialValue={ activeTab }
            onValueChange={ setActiveTab }
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
                    onPress={ ()=> clearBookmarks('followedOutlets') }>
                    {strings.action_clearSelection}
                  </Button>
                </View>
              </View>
              {outlets.map((outlet, i) => (
                <View 
                  key={ outlet.name }
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
                    onPress={ () => openOutlet(outlet) }>
                    {outlet.displayName}
                  </Button>
                  <View row />
                  <Button
                    row
                    itemsCenter
                    rounded
                    gap={ 8 }
                    p={ 8 }
                    elevated
                    leftIcon={ selectedOutlets?.[outlet.name] ? 'check' : undefined }
                    haptic
                    onPress={ () => {
                      setSelectedOutlets((prev) => {
                        const state = { ...prev };
                        if (outlet.name in state) {
                          delete state[outlet.name];
                        } else {
                          state[outlet.name] = true;
                        }
                        return (prev = state);
                      });
                      followOutlet(outlet);
                    } }>
                    {selectedOutlets?.[outlet.name] ? strings.action_unfollow : strings.action_follow}
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