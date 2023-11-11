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
    api: { logout },
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
              cellStyle="RightDetail"
              title={ `${strings.bookmarks} (${bookmarkCount})` }
              accessory="DisclosureIndicator"
              detail={ `${unreadBookmarkCount} ${strings.unread}` } 
              onPress={ () => navigation?.push('bookmarks') } />
          </TableViewSection>
          <TableViewSection>
            <TableViewCell 
              bold
              cellStyle="RightDetail"
              title={ strings.publishers }
              accessory="DisclosureIndicator"
              detail={ `${Object.keys(followedPublishers ?? {}).length ?? 0} ${strings.following}` }
              onPress={ () => navigation?.push('publisherPicker') } />
            <TableViewCell 
              bold
              cellStyle="RightDetail"
              title={ strings.categories }
              accessory="DisclosureIndicator"
              detail={ `${Object.keys(followedCategories ?? {}).length ?? 0} ${strings.following}` }
              onPress={ () => navigation?.push('categoryPicker') } />
          </TableViewSection>
          <TableViewSection>
            <TableViewCell
              bold
              title={ 'Sign Out' }
              onPress={ async () => {
                await logout();
                setStoredValue('userData'); 
              } } />
          </TableViewSection>
        </TableView>
      </ScrollView>
    </Screen>
  );
}