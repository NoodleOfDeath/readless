import React from 'react';

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
import { StorageContext, ToastContext } from '~/contexts';
import { useThirdPartyLogin } from '~/hooks';
import { strings } from '~/locales';
import { ScreenComponent } from '~/screens/types';

export function AccountScreen({
  route: _route,
  navigation: _navigation, 
}: ScreenComponent<'account'>) {

  const { userData } = React.useContext(StorageContext);
  const { showToast } = React.useContext(ToastContext);
  
  const {
    linkThirdPartyAccount,
    unlinkThirdPartyAccount,
    requestDeleteAccount,
  } = useThirdPartyLogin(showToast);

  const handleRequestDeleteAccount = React.useCallback(async () => {
    try {
      await requestDeleteAccount();
      showToast(strings.aDeleteAccountConfirmationEmailHasBeenSentToYourEmail);
    } catch (e) {
      console.error(e);
    }
  }, [requestDeleteAccount, showToast]);
  
  return (
    <Screen>
      <ScrollView>
        <TableView>
          <TableViewSection
            grouped 
            header={ strings.personalInformation }>
            {userData?.profile?.email && (
              <TableViewCell
                cellIcon={ <Icon name="email" /> }
                title={ strings.email }
                detail={ userData?.profile?.email } />
            )}
            {userData?.profile?.username && (
              <TableViewCell
                cellIcon={ <Icon name="pen" /> }
                title={ strings.username }
                detail={ userData?.profile?.username } />
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
                  detail={ userData?.profile?.linkedThirdPartyAccounts?.includes(p) ? strings.disconnect : strings.connect }
                  onPress={ () => {
                    if (userData?.profile?.linkedThirdPartyAccounts?.includes(p)) {
                      unlinkThirdPartyAccount(p);
                    } else {
                      linkThirdPartyAccount(p);
                    } 
                  } } />
                {i < Object.values(ThirdParty).length - 1 && <Divider key={ `divider-${i}` } />}
              </React.Fragment>
            ))}
            {__DEV__ && (
              <TableViewCell
                cellContentView={ <Text>{JSON.stringify(userData, null, 2)}</Text> } />
            )}
          </TableViewSection>
          {!userData?.unlinked && (
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