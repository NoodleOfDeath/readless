import React from 'react';

import { ScreenComponent } from '../types';

import { ThirdParty } from '~/api';
import { 
  Icon,
  Screen,
  ScrollView,
  TableView,
  TableViewCell,
  TableViewSection,
} from '~/components';
import { StorageContext } from '~/contexts';
import { useThirdPartyLogin } from '~/hooks';
import { strings } from '~/locales';

export function AccountScreen({
  route: _route,
  navigation: _navigation, 
}: ScreenComponent<'account'>) {
  
  const { userData } = React.useContext(StorageContext);
  
  const {
    linkThirdPartyAccount,
    unlinkThirdPartyAccount,
    deleteAccount,
  } = useThirdPartyLogin();
  
  return (
    <Screen>
      <ScrollView>
        <TableView>
          <TableViewSection>
            {/* <TableViewCell
              cellContentView={ <Text>{JSON.stringify(userData, null, 2)}</Text> } /> */}
            {userData?.profile?.email && (
              <TableViewCell 
                cellStyle="RightDetail"
                accessory="DisclosureIndicator"
                title={ userData?.profile?.email } />
            )}
            {userData?.profile?.username && (
              <TableViewCell 
                cellStyle="RightDetail"
                title={ strings.username }
                detail={ userData?.profile?.username } />
            )}
          </TableViewSection>
          <TableViewSection
            header={ strings.linkedThirdPartyAccounts }>
            {Object.values(ThirdParty).map((p) => (
              <TableViewCell 
                key={ p }
                capitalize
                cellIcon={ <Icon name={ p } /> }
                cellStyle="RightDetail"
                title={ p }
                detail={ userData?.profile?.linkedThirdPartyAccounts?.includes(p) ? strings.disconnect : strings.connect }
                onPress={ () => {
                  if (userData?.profile?.linkedThirdPartyAccounts?.includes(p)) {
                    unlinkThirdPartyAccount(p);
                  } else {
                    linkThirdPartyAccount(p);
                  } 
                } } />
            ))}
          </TableViewSection>
          {!userData?.unlinked && (
            <TableViewSection>
              <TableViewCell
                title={ strings.deleteAccount }
                titleTextColor="red"
                onPress={ () => {
                  deleteAccount(); 
                } } />
            </TableViewSection>
          )}
        </TableView>
      </ScrollView>
    </Screen>
  );
}