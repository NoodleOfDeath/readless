import React from 'react';
import { Alert } from 'react-native';

import { ScreenComponent } from '../types';

import {
  Button,
  Screen,
  ScrollView,
  TableView,
  TableViewCell,
  TableViewSection,
} from '~/components';
import { StorageContext } from '~/contexts';
import { strings } from '~/locales';

export function ProfileScreen({
  route: _route,
  navigation,
}: ScreenComponent<'profile'>) {

  const {
    isSyncingBookmarks,
    bookmarkCount,
    unreadBookmarkCount,
    followedPublishers,
    followedCategories,
    userData, 
    setStoredValue, 
    api: { logout },
  } = React.useContext(StorageContext);

  const signOut = React.useCallback(async () => {
    await logout({});
    setStoredValue('userData');
  }, [logout, setStoredValue]);

  const handleSignOut = React.useCallback(() => {
    if (userData?.unlinked) {
      Alert.alert(
        strings.accountIsNotLinkedToAnEmail, 
        strings.ifYouSignOutYouWillNotBeAbleToRecover,
        [
          {
            style: 'cancel',
            text: strings.cancel,
          },
          {
            onPress: () => signOut(), 
            text: strings.yesSignOut,
          },
        ]
      );
    } else {
      signOut();
    }
  }, [signOut, userData?.unlinked]);

  return (
    <Screen>
      <ScrollView>
        <TableView>
          <TableViewSection>
            <TableViewCell 
              cellStyle="RightDetail"
              accessory="DisclosureIndicator"
              title={ strings.account }
              onPress={ () => navigation?.push('account') } />
          </TableViewSection>
          <TableViewSection>
            <TableViewCell 
              cellIcon={ <Button leftIcon="bookmark" /> }
              disabled={ isSyncingBookmarks }
              cellStyle="RightDetail"
              title={ `${strings.bookmarks} (${isSyncingBookmarks ? 'syncing...' : bookmarkCount})` }
              accessory="DisclosureIndicator"
              detail={ `${unreadBookmarkCount} ${strings.unread}` } 
              onPress={ isSyncingBookmarks ? undefined : () => navigation?.push('bookmarks') } />
          </TableViewSection>
          <TableViewSection>
            <TableViewCell 
              cellIcon={ <Button leftIcon="pen" /> }
              cellStyle="RightDetail"
              title={ strings.publishers }
              accessory="DisclosureIndicator"
              detail={ `${Object.keys(followedPublishers ?? {}).length ?? 0} ${strings.following}` }
              onPress={ () => navigation?.push('publisherPicker') } />
            <TableViewCell 
              cellIcon={ <Button leftIcon="bucket" /> }
              cellStyle="RightDetail"
              title={ strings.categories }
              accessory="DisclosureIndicator"
              detail={ `${Object.keys(followedCategories ?? {}).length ?? 0} ${strings.following}` }
              onPress={ () => navigation?.push('categoryPicker') } />
          </TableViewSection>
          <TableViewSection>
            <TableViewCell
              cellIcon={ <Button leftIcon="logout" /> }
              title={ strings.signOut }
              onPress={ handleSignOut } />
          </TableViewSection>
        </TableView>
      </ScrollView>
    </Screen>
  );
}