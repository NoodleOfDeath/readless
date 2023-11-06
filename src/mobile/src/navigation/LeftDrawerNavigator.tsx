import React from 'react';

import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  createDrawerNavigator,
} from '@react-navigation/drawer';

import { TabbedNavigator } from './TabbedNavigator';

import {
  Button,
  ChannelIcon,
  DrawerItem,
  DrawerSection,
  Icon,
  Screen,
  View,
} from '~/components';
import { StorageContext } from '~/contexts';
import { useNavigation } from '~/hooks';
import { strings } from '~/locales';

function TabbedScreen() {
  return (
    <Screen safeArea={ false }>
      <TabbedNavigator />
    </Screen>
  );
}

export function LeftDrawerContent(props: DrawerContentComponentProps) {
  
  const {
    navigate,
    openCategory,
    openPublisher,
  } = useNavigation();
  
  const {
    categories,
    publishers,
    bookmarkCount,
    unreadBookmarkCount,
    followedCategories,
    favoritedCategories,
    followedPublishers,
    favoritedPublishers,
    favoriteCategory,
    favoritePublisher,
    categoryIsFavorited,
    publisherIsFavorited,
    viewFeature,
    hasViewedFeature,
  } = React.useContext(StorageContext);

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
            <Button
              haptic
              leftIcon="star" 
              accessibilityLabel={ strings.action_unfavorite }
              onPress={ () => favoritePublisher(publisher) } />
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
            <Button
              haptic
              leftIcon="star" 
              accessibilityLabel={ strings.action_unfavorite }
              onPress={ () => favoriteCategory(category) } />
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
              haptic
              leftIcon={ publisherIsFavorited(publisher) ? 'star' : 'star-outline' }
              accessibilityLabel={ publisherIsFavorited(publisher) ? strings.action_unfavorite : strings.action_favorite }
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
          icon={ (props) => <Icon { ...props } name={ category.icon } /> }
          onPress={ () => openCategory(category) }
          right={ () => (
            <Button
              haptic
              leftIcon={ categoryIsFavorited(category) ? 'star' : 'star-outline' }
              accessibilityLabel={ categoryIsFavorited(category) ? strings.action_unfavorite : strings.action_favorite }
              onPress={ () => favoriteCategory(category) } />
          ) } />
      );
    }).filter(Boolean);
    return items;
  }, [categories, followedCategories, openCategory, categoryIsFavorited, favoriteCategory]);
  
  return (
    <DrawerContentScrollView { ...props }>
      <DrawerSection>
        <DrawerItem
          label={ `${strings.screens_bookmarks} (${bookmarkCount})` }
          icon={ (props) => (
            <Button 
              { ...props }
              badge={ unreadBookmarkCount }
              iconSize={ 24 }
              leftIcon="bookmark" />
          ) }
          onPress= { () => navigate('bookmarks') } />
      </DrawerSection>
      {favorites.length > 0 && (
        <DrawerSection
          title={ strings.misc_favorites }>
          {favorites}
        </DrawerSection>
      )}
      <DrawerSection 
        title={ strings.misc_publishers }
        gap={ 6 }
        indicator={ !hasViewedFeature('first-view-publishers') } 
        rightIcon="menu-right"
        onPress={ () => {
          viewFeature('first-view-publishers');
          navigate('publisherPicker');
        } }>
        {publisherItems}
      </DrawerSection>
      <DrawerSection
        title={ strings.misc_categories }
        gap={ 6 }
        indicator={ !hasViewedFeature('first-view-categories') } 
        rightIcon="menu-right"
        onPress={ () => {
          viewFeature('first-view-categories');
          navigate('categoryPicker');
        } }>
        {categoryItems}
      </DrawerSection>      
      <View my={ 12 } />
    </DrawerContentScrollView>
  );
}

const LeftDrawer = createDrawerNavigator();

export function LeftDrawerNavigator() {
  return (
    <LeftDrawer.Navigator 
      id="leftDrawerNav"
      initialRouteName={ 'home' }
      screenOptions={ ({ route: _route }) => ({
        headerShown: false,
        swipeEnabled: false,
      }) }
      drawerContent={ (props) => <LeftDrawerContent { ...props } /> }>
      <LeftDrawer.Screen 
        name={ strings.screens_home } 
        component={ TabbedScreen } />
    </LeftDrawer.Navigator>
  );
}