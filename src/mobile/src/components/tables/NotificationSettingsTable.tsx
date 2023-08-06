import React from 'react';
import { Platform } from 'react-native';

import RNFS from 'react-native-fs';

import { ReadingFormat } from '~/api';
import {
  BASE_LETTER_SPACING,
  BASE_LINE_HEIGHT_MULTIPLIER,
  FONT_SIZES,
  NumericPrefPicker,
  PrefSwitch,
  SYSTEM_FONT,
  ScrollView,
  Summary,
  TableView,
  TableViewCell,
  TableViewSection,
} from '~/components';
import { NotificationContext, SessionContext } from '~/contexts';
import { useNavigation } from '~/hooks';
import { strings } from '~/locales';

export function NotificationSettingsTable() {
  
  const { navigate } = useNavigation();
  
  const {
    compactSummaries,
    colorScheme, 
    fcmToken: unsubscribeToken,
    fontFamily, 
    preferredShortPressFormat,
    preferredReadingFormat,
    resetPreferences, 
    triggerWords,
    readSummaries,
    removedSummaries,
    setPreference,
  } = React.useContext(SessionContext);
  
  const {
    registerRemoteNotifications,
    unsubscribe,
  } = React.useContext(NotificationContext);
  
  return (
    <TableView 
      flexGrow={ 1 }>
      <TableViewSection>
        <TableViewCell
          bold
          title={ strings.settings_pushNotifications || 'Push Notifications' }
          cellIcon="view-headline"
          cellAccessoryView={ (
            <PrefSwitch 
              prefKey='pushNotifications'
              onValueChange={ async (value) => {
                if (value === true) {
                  await registerRemoteNotifications();
                } else {
                  await unsubscribe({ unsubscribeToken });
                  setPreference('fcmToken', undefined);
                }
              } } />
          ) } />
      </TableViewSection>
    </TableView>
  );
}

