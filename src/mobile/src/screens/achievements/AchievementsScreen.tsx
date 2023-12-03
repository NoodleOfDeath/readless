import React from 'react';

import { ScreenComponent } from '../types';

import {
  Screen,
  ScrollView,
  TableView,
  TableViewCell,
  TableViewSection,
} from '~/components';
import { StorageContext } from '~/contexts';

export function AchievementsScreen({ navigation }: ScreenComponent<'notifications'>) {

  const { userData } = React.useContext(StorageContext);

  return (
    <Screen>
      <ScrollView>
        <TableView>
          <TableViewSection grouped>
            {userData?.profile?.stats?.achievements.map((achievement) => (
              <TableViewCell 
                key={ achievement.id }
                subtitle
                accessory={ 'DisclosureIndicator' }
                title={ achievement.achievement.displayName }
                cellIcon={ 'star' }
                detail={ achievement.achievement.description }
                onPress={ () => {
                  navigation?.push('achievement', achievement); 
                } } />
            ))}
          </TableViewSection>
        </TableView>
      </ScrollView>
    </Screen>
  );

}