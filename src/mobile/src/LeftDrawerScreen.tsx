import React from 'react';

import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  createDrawerNavigator,
} from '@react-navigation/drawer';

import { StackNavigation } from './StackNavigation';

import {
  Button,
  ChannelIcon,
  DrawerItem,
  DrawerSection,
  Icon,
  Screen,
  Text,
  View,
} from '~/components';
import { SessionContext } from '~/contexts';
import { useNavigation } from '~/hooks';
import { strings } from '~/locales';

function HomeDrawer() {
  return (
    <Screen>
      <StackNavigation />
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
  } = React.useContext(SessionContext);

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
    if (items.length === 0) {
      items.push(
        <DrawerItem 
          key="missing-publishers"
          label={ (
            <Text flex={ 1 } numberOfLines={ 3 }>
              { strings.misc_noPublishers }
            </Text>
          ) } />
      );
    }
    items.push(
      <DrawerItem 
        key="browse-publishers"
        label={ strings.nav_browsePublishers }
        onPress={ () => {
          viewFeature('first-view-publishers');
          navigate('publisherPicker');
        } }
        icon={ (_props) => (
          <Button
            leftIcon="pen"
            iconSize={ 24 }
            indicator={ !hasViewedFeature('first-view-publishers') } />
        ) }
        right={ (props) => <Icon { ...props } name="menu-right" /> } />
    );
    return items;
  }, [publishers, followedPublishers, openPublisher, publisherIsFavorited, favoritePublisher, viewFeature, navigate, hasViewedFeature]);
  
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
              leftIcon={ categoryIsFavorited(category) ? 'star' : 'star-outline' }
              onPress={ () => favoriteCategory(category) } />
          ) } />
      );
    }).filter(Boolean);
    if (items.length === 0) {
      items.push(
        <DrawerItem 
          key="missing-categories"
          label={ (
            <Text flex={ 1 } numberOfLines={ 3 }>
              { strings.misc_noCategories }
            </Text>
          ) } />
      );
    }
    items.push(
      <DrawerItem 
        key="browse-categories"
        label={ strings.nav_browseCategories }
        onPress={ () => {
          viewFeature('first-view-categories');
          navigate('categoryPicker');
        } }
        icon={ (_props) => (
          <Button
            leftIcon="shape"
            iconSize={ 24 }
            indicator={ !hasViewedFeature('first-view-categories') } />
        ) }
        right={ (props) => <Icon { ...props } name="menu-right" /> } />
    );
    return items;
  }, [categories, followedCategories, openCategory, categoryIsFavorited, favoriteCategory, viewFeature, navigate, hasViewedFeature]);
  
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
        title={ strings.misc_publishers }>
        {publisherItems}
      </DrawerSection>
      <DrawerSection
        title={ strings.misc_categories }>
        {categoryItems}
      </DrawerSection>
      <View my={ 12 } />
    </DrawerContentScrollView>
  );
}

const LeftDrawer = createDrawerNavigator();

export function LeftDrawerScreen() {
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
        name={ strings.screens_home } 
        component={ HomeDrawer } />
    </LeftDrawer.Navigator>
  );
}