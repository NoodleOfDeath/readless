import React from 'react';

import { ScreenComponent } from '../types';

import {
  Screen,
  ScrollView,
  TableView,
  TableViewCell,
  TableViewSection,
  Text,
} from '~/components';
import { StorageContext } from '~/contexts';
import { strings } from '~/locales';

export function ProfileScreen({
  route: _route,
  navigation,
}: ScreenComponent<'profile'>) {

  const {
    bookmarkCount,
    unreadBookmarkCount,
    followedPublishers,
    followedCategories,
    userData, 
    setStoredValue, 
  } = React.useContext(StorageContext);

  return (
    <Screen>
      <ScrollView>
        <TableView>
          <TableViewSection>
            <TableViewCell 
              bold
              title={ userData?.profile?.email } />
          </TableViewSection>
          <TableViewSection>
            <TableViewCell 
              bold
              title={ `${strings.screens_bookmarks} (${bookmarkCount})` }
              cellAccessoryView={ <Text>{ `${unreadBookmarkCount} ${strings.misc_unread}` }</Text> } 
              onPress={ () => navigation?.push('bookmarks') } />
          </TableViewSection>
          <TableViewSection>
            <TableViewCell 
              bold
              title={ strings.misc_publishers }
              cellAccessoryView={ <Text>{ `${Object.keys(followedPublishers ?? {}).length ?? 0} ${strings.misc_following}` }</Text> }
              onPress={ () => navigation?.push('publisherPicker') } />
            <TableViewCell 
              bold
              title={ strings.misc_categories }
              cellAccessoryView={ <Text>{ `${Object.keys(followedCategories ?? {}).length ?? 0} ${strings.misc_following}` }</Text> }
              onPress={ () => navigation?.push('categoryPicker') } />
          </TableViewSection>
          <TableViewSection>
            <TableViewCell
              bold
              title={ 'Sign Out' }
              onPress={ () => {
                setStoredValue('userData'); 
              } } />
          </TableViewSection>
        </TableView>
      </ScrollView>
    </Screen>
  );
}