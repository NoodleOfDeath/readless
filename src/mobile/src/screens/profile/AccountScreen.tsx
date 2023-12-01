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
  const [hasSynced, setHasSynced] = React.useState(false);
  
  const { 
    api: { logout },
    userData, 
    setStoredValue,
    syncWithRemote,
  } = React.useContext(StorageContext);
  const { showToast } = React.useContext(ToastContext);
  
  const {
    linkThirdPartyAccount,
    unlinkThirdPartyAccount,
    requestDeleteAccount,
  } = useThirdPartyLogin(showToast);

  const onMount = React.useCallback(async () => {
    try {
      if (hasSynced) {
        return;
      }
      setHasSynced(true);
      await syncWithRemote();
    } catch (e) {
      console.error(e);
      showToast(e);
    }
  }, [hasSynced, syncWithRemote, showToast]);

  const signOut = React.useCallback(async () => {
    await logout({});
    await setStoredValue('userData', undefined, false);
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
          <TableViewSection
            grouped 
            header={ strings.personalInformation }>
            {user?.profile?.email && (
              <TableViewCell
                cellIcon={ <Icon name="email" /> }
                title={ strings.email }
                detail={ user?.profile?.email } />
            )}
            {user?.profile?.username && (
              <TableViewCell
                cellIcon={ <Icon name="pen" /> }
                title={ strings.username }
                detail={ user?.profile?.username } />
            )}
          </TableViewSection>
          <TableViewSection
            grouped
            header={ strings.linkedThirdPartyAccounts }>
            {Object.values(ThirdParty).map((p, i) => (
              <React.Fragment
                key={ p }>
                <TableViewCell 
                  capitalize
                  cellIcon={ <Icon name={ p } /> }
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
          <TableViewSection grouped>
            <TableViewCell
              cellIcon={ <Button leftIcon="logout" /> }
              title={ strings.signOut }
              onPress={ handleSignOut } />
            {__DEV__ && (
              <TableViewCell
                cellContentView={ <Text>{JSON.stringify(user, null, 2)}</Text> } />
            )}
          </TableViewSection>
          {!user?.unlinked && (
            <TableViewSection
              grouped
              header={ strings.dangerZone }>
              <TableViewCell
                cellIcon={ <Button leftIcon="delete" destructive /> }
                title={ strings.deleteAccount }
                color="red"
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