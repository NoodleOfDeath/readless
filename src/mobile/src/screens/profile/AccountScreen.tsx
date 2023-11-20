import React from 'react';
import { Alert } from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

import { ScreenComponent } from '../types';

import { ThirdParty } from '~/api';
import { 
  Button,
  Divider,
  Icon,
  Screen,
  ScrollView,
  TableView,
  TableViewCell,
  TableViewSection,
  Text,
} from '~/components';
import {
  StorageContext,
  ToastContext,
  UserData,
} from '~/contexts';
import { useThirdPartyLogin } from '~/hooks';
import { strings } from '~/locales';

export function AccountScreen({
  route: _route,
  navigation: _navigation, 
}: ScreenComponent<'account'>) {

  const [user, setUser] = React.useState<UserData>();
  
  const { 
    api: { getProfile, logout },
    userData, 
    setStoredValue,
  } = React.useContext(StorageContext);
  const { showToast } = React.useContext(ToastContext);
  
  const {
    linkThirdPartyAccount,
    unlinkThirdPartyAccount,
    requestDeleteAccount,
  } = useThirdPartyLogin();

  const onMount = React.useCallback(async () => {
    try {
      const { data, error } = await getProfile();
      if (error) {
        throw error;
      }
      if (data) {
        await setStoredValue('userData', (prev) => new UserData({
          ...prev,
          profile: data.profile,
        }));
      }
    } catch (e) {
      console.error(e);
      showToast(e);
    }
  }, [getProfile, setStoredValue, showToast]);

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

  const handleRequestDeleteAccount = React.useCallback(async () => {
    try {
      await requestDeleteAccount();
      showToast(strings.aDeleteAccountConfirmationEmailHasBeenSentToYourEmail);
    } catch (e) {
      console.error(e);
    }
  }, [requestDeleteAccount, showToast]);

  useFocusEffect(React.useCallback(() => {
    setUser(userData);
    onMount();
  }, [userData, onMount]));
  
  return (
    <Screen>
      <ScrollView>
        <TableView>
          <TableViewSection>
            {__DEV__ && (
              <TableViewCell
                cellContentView={ <Text>{JSON.stringify(user, null, 2)}</Text> } />
            )}
            {user?.profile?.email && (
              <TableViewCell 
                cellStyle="RightDetail"
                title={ user?.profile?.email } />
            )}
            {user?.profile?.username && (
              <React.Fragment>
                <Divider />
                <TableViewCell 
                  cellStyle="RightDetail"
                  title={ strings.username }
                  detail={ user?.profile?.username } />
              </React.Fragment>
            )}
          </TableViewSection>
          <TableViewSection
            header={ strings.linkedThirdPartyAccounts }>
            {Object.values(ThirdParty).map((p, i) => (
              <React.Fragment
                key={ p }>
                <TableViewCell 
                  capitalize
                  cellIcon={ <Icon name={ p } /> }
                  cellStyle="RightDetail"
                  title={ p }
                  detail={ user?.profile?.linkedThirdPartyAccounts?.includes(p) ? strings.disconnect : strings.connect }
                  onPress={ () => {
                    if (user?.profile?.linkedThirdPartyAccounts?.includes(p)) {
                      unlinkThirdPartyAccount(p);
                    } else {
                      linkThirdPartyAccount(p);
                    } 
                  } } />
                {i < Object.values(ThirdParty).length - 1 && <Divider key={ `divider-${i}` } />}
              </React.Fragment>
            ))}
          </TableViewSection>
          <TableViewSection>
            <TableViewCell
              cellIcon={ <Button leftIcon="logout" /> }
              title={ strings.signOut }
              onPress={ handleSignOut } />
          </TableViewSection>
          {!user?.unlinked && (
            <TableViewSection>
              <TableViewCell
                cellIcon={ <Button leftIcon="delete" /> }
                title={ strings.deleteAccount }
                titleTextColor="red"
                onPress={ () => {
                  handleRequestDeleteAccount();
                } } />
            </TableViewSection>
          )}
        </TableView>
      </ScrollView>
    </Screen>
  );
}