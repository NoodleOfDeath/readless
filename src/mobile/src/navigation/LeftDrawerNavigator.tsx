import React from 'react';

import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  createDrawerNavigator,
} from '@react-navigation/drawer';
import { Avatar } from 'react-native-paper';

import { RoutedScreen } from './RoutedScreen';
import { StackNavigator } from './StackNavigator';
import { HOME_STACK } from './stacks';

import {
  Button,
  ChannelIcon,
  DrawerItem,
  DrawerSection,
} from '~/components';
import { StorageContext } from '~/contexts';
import { useNavigation } from '~/hooks';
import { strings } from '~/locales';
import { usePlatformTools } from '~/utils';

function HomeDrawer() {
  return (
    <RoutedScreen navigationID='LeftDrawerNav' safeArea={ false }>
      <StackNavigator
        id='LeftDrawerNav'
        initialRouteName='home'
        screens={ HOME_STACK } />
    </RoutedScreen>
  );
}

export function LeftDrawerContent(props: DrawerContentComponentProps) {
  
  const {
    navigate,
    openCategory,
    openPublisher,
  } = useNavigation();
  const { getUserAgent } = usePlatformTools();

  const {
    bookmarks,
    unreadBookmarkCount,
    categories,
    publishers,
    followedPublishers,
    followedCategories,
    favoritedCategories,
    favoritedPublishers,
    favoriteCategory,
    favoritePublisher,
    publisherIsFavorited,
    categoryIsFavorited,
    viewFeature,
    hasViewedFeature,
    userData,
  } = React.useContext(StorageContext);

  const isSyncingBookmarks = React.useMemo(() => {
    return bookmarks?.isFetching ?? false;
  }, [bookmarks]);

  const topPublishers = React.useMemo(() => {
    if (!publishers) {
      return [];
    }
    const items = Object.keys({ ...favoritedPublishers }).sort().map((p) => {
      const publisher = publishers[p];
      if (!publisher) {
        return undefined;
      }
      return (
        <DrawerItem
          key={ publisher.name }
          label={ publisher.displayName }
          icon={ (props) => <ChannelIcon { ...props } publisher={ publisher } /> }
          onPress={ () => openPublisher(publisher) }
          right={ () => (
            <Button leftIcon="star" onPress={ () => favoritePublisher(publisher) } />
          ) } />
      );
    }).filter(Boolean);
    return items;
  }, [publishers, favoritedPublishers, openPublisher, favoritePublisher]);

  const topCategories = React.useMemo(() => {
    if (!categories) {
      return [];
    }
    const items = Object.keys({ ...favoritedCategories }).sort().map((c) => {
      const category = categories[c];
      if (!category) {
        return undefined;
      }
      return (
        <DrawerItem
          key={ category.name }
          label={ category.displayName }
          icon={ (props) => <ChannelIcon { ...props } category={ category } /> }
          onPress={ () => openCategory(category) }
          right={ () => (
            <Button leftIcon="star" onPress={ () => favoriteCategory(category) } />
          ) } />
      );
    }).filter(Boolean);
    return items;
  }, [categories, favoriteCategory, favoritedCategories, openCategory]);

  const favorites = React.useMemo(() => [...topPublishers, ...topCategories], [topPublishers, topCategories]);

  const publisherItems = React.useMemo(() => {
    if (!publishers) {
      return [];
    }
    const items = Object.keys({ ...followedPublishers }).sort().map((p) => {
      const publisher = publishers[p];
      if (!publisher) {
        return undefined;
      }
      return (
        <DrawerItem
          key={ publisher.name }
          label={ publisher.displayName }
          icon={ (props) => <ChannelIcon { ...props } publisher={ publisher } /> }
          onPress={ () => openPublisher(publisher) }
          right={ () => (
            <Button 
              leftIcon={ publisherIsFavorited(publisher) ? 'star' : 'star-outline' }
              onPress={ () => favoritePublisher(publisher) } />
          ) } />
      );
    }).filter(Boolean);
    return items;
  }, [publishers, followedPublishers, openPublisher, publisherIsFavorited, favoritePublisher]);

  const categoryItems = React.useMemo(() => {
    if (!categories) {
      return [];
    }
    const items = Object.keys({ ...followedCategories }).sort().map((c) => {
      const category = categories[c];
      if (!category) {
        return undefined;
      }
      return (
        <DrawerItem
          key={ category.name }
          label={ category.displayName }
          icon={ (props) => <ChannelIcon { ...props } category={ category } /> }
          onPress={ () => openCategory(category) }
          right={ () => (
            <Button
              leftIcon={ categoryIsFavorited(category) ? 'star' : 'star-outline' }
              onPress={ () => favoriteCategory(category) } />
          ) } />
      );
    }).filter(Boolean);
    return items;
  }, [categories, followedCategories, openCategory, categoryIsFavorited, favoriteCategory]);

  return (
    <React.Fragment>
      <DrawerContentScrollView { ...props }>
        <DrawerSection>
          <DrawerItem 
            icon={ (props) => (
              <Button
                { ...props }
                leftIcon="bookmark"
                indicator={ unreadBookmarkCount > 0 && !hasViewedFeature('bookmarks') } />
            ) }
            disabled={ isSyncingBookmarks }
            label={ [strings.bookmarks, isSyncingBookmarks ? `${strings.syncing}...` : unreadBookmarkCount > 0 ? `(${unreadBookmarkCount})` : ''].filter(Boolean).join(' ') }
            onPress={ isSyncingBookmarks ? undefined : () => {
              viewFeature('bookmarks');
              navigate('bookmarks');
            } } />
        </DrawerSection>
        {favorites.length > 0 && (
          <DrawerSection
            title={ strings.favorites }>
            {favorites}
          </DrawerSection>
        )}
        {publisherItems.length > 0 && (
          <DrawerSection
            title={ strings.publishersYouFollow }>
            {publisherItems}
          </DrawerSection>
        )}
        {categoryItems.length > 0 && (
          <DrawerSection
            title={ strings.categoriesYouFollow }>
            {categoryItems}
          </DrawerSection>
        )}
      </DrawerContentScrollView>
      <DrawerSection showDivider={ false }>
        <DrawerItem
          label={ strings.settings }
          icon={ (props) => (
            <Button
              indicator={
                !hasViewedFeature('publishers') || 
                !hasViewedFeature('categories') || 
                !hasViewedFeature('display-preferences') ||
                !hasViewedFeature('notifications') || 
                !hasViewedFeature('app-review')
              } 
              leftIcon={ <Avatar.Text label={ userData?.profile?.username?.slice(0, 2).toUpperCase() ?? '??' } size={ 36 } /> }
              { ...props } />
          ) }
          right={ () => (<Button leftIcon="dots-horizontal" />) }
          onPress={ () => navigate('settings') } />
        {__DEV__ && (
          <DrawerItem
            mb={ 24 }
            label={ getUserAgent().currentVersion } />
        )}
      </DrawerSection>
    </React.Fragment>
  );
}

const LeftDrawer = createDrawerNavigator();

export function LeftDrawerNavigator() {
  return (
    <LeftDrawer.Navigator 
      id="LeftDrawer"
      initialRouteName={ 'home' }
      screenOptions={ ({ route: _route }) => ({
        headerShown: false,
        swipeEnabled: false,
      }) }
      drawerContent={ (props) => <LeftDrawerContent { ...props } /> }>
      <LeftDrawer.Screen 
        name={ strings.home } 
        component={ HomeDrawer } />
    </LeftDrawer.Navigator>
  );
}