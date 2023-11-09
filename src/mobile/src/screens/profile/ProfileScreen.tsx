import React from 'react';

import {
  Screen,
  ScrollView,
  TableView,
  TableViewCell,
  TableViewSection,
} from '~/components';
import { StorageContext } from '~/contexts';

export function ProfileScreen() {

  const { userData, setStoredValue } = React.useContext(StorageContext);

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