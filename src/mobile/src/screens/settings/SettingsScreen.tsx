import React from 'react';
import { Alert, Platform } from 'react-native';

import { APP_STORE_LINK, PLAY_STORE_LINK } from '@env';

import {
  Button,
  ContextMenu,
  Screen,
  ScrollView,
  TableView,
  TableViewCell,
  TableViewSection,
  View,
} from '~/components';
import { StorageContext } from '~/contexts';
import { useInAppBrowser, useNavigation } from '~/hooks';
import { TikTokIcon } from '~/icons';
import { strings } from '~/locales';
import { ScreenComponent } from '~/screens/types';
import { usePlatformTools } from '~/utils';

export function SettingsScreen({ route: _route }: ScreenComponent<'settings'>) {

  const { openURL } = useInAppBrowser();
  const { getUserAgent } = usePlatformTools();
  const { navigate } = useNavigation();

  const {
    api: { logout },
    followedPublishers,
    followedCategories,
    userData, 
    viewFeature,
    hasViewedFeature,
    setStoredValue,
  } = React.useContext(StorageContext);

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

  return (
    <Screen>
      <ScrollView>
        <TableView>
          <TableViewSection
            grouped
            header={ strings.account }>
            <TableViewCell 
              cellIcon={ <Button leftIcon="account" /> }
              cellStyle="RightDetail"
              accessory="DisclosureIndicator"
              title={ strings.account }
              detail={ userData?.profile?.email ?? userData?.profile?.username }
              onPress={ () => navigate('account') } />
            <TableViewCell
              cellIcon={ <Button leftIcon="logout" /> }
              title={ strings.signOut }
              onPress={ handleSignOut } />
          </TableViewSection>
          <TableViewSection
            grouped
            header={ strings.contentPreferences }>
            <TableViewCell
              cellIcon={ (
                <Button
                  leftIcon="eye" 
                  indicator={ !hasViewedFeature('display-preferences') } />
              ) }
              cellStyle="RightDetail"
              accessory="DisclosureIndicator"
              title={ strings.displayPreferences }
              onPress={ () => {
                viewFeature('display-preferences');
                navigate('displayPreferences');
              } } />
            <TableViewCell 
              cellIcon={ <Button leftIcon="pen" indicator={ !hasViewedFeature('publishers') } /> }
              cellStyle="RightDetail"
              title={ strings.publishers }
              accessory="DisclosureIndicator"
              detail={ `${Object.keys(followedPublishers ?? {}).length ?? 0} ${strings.following}` }
              onPress={ () =>{
                viewFeature('publishers');
                navigate('publisherPicker'); 
              } } />
            <TableViewCell 
              cellIcon={ <Button leftIcon="bucket" indicator={ !hasViewedFeature('categories') } /> }
              title={ strings.categories }
              accessory="DisclosureIndicator"
              detail={ `${Object.keys(followedCategories ?? {}).length ?? 0} ${strings.following}` }
              onPress={ () => {
                viewFeature('categories');
                navigate('categoryPicker'); 
              } } />
            {__DEV__ && (
              <TableViewCell
                cellIcon={ (
                  <Button
                    leftIcon="cog" />
                ) }
                accessory="DisclosureIndicator"
                title={ strings.manage }
                onPress={ () => {
                  navigate('generalSettings');
                } } />
            )}
          </TableViewSection>
          <TableViewSection
            grouped
            header={ strings.notifications }>
            <TableViewCell
              title={ strings.notifications }
              cellIcon={ (
                <Button
                  leftIcon="bell" 
                  indicator={ !hasViewedFeature('notifications') } />
              ) }
              accessory="DisclosureIndicator"
              onPress={ () => {
                viewFeature('notifications');
                navigate('notificationSettings');
              } } />
          </TableViewSection> 
          <TableViewSection
            grouped
            header={ strings.community }>
            <TableViewCell
              cellContentView={ (
                <View
                  m={ 12 } 
                  flexRow
                  gap={ 6 }
                  itemsCenter
                  justifyCenter
                  flexWrap="wrap">
                  <Button
                    leftIcon={ <TikTokIcon /> }
                    contained
                    gap={ 12 }
                    onPress={ () => {
                      openURL('https://www.tiktok.com/@readless.ai');
                    } }>
                    TikTok
                  </Button>
                  <Button
                    leftIcon="discord"
                    contained
                    gap={ 12 }
                    onPress={ () => {
                      openURL('https://discord.gg/2gw3dP2a4u');
                    } }>
                    Discord
                  </Button>
                  <Button
                    leftIcon="instagram"
                    contained
                    gap={ 12 }
                    onPress={ () => {
                      openURL('https://instagram.com/readless.ai');
                    } }>
                    Instagram
                  </Button>
                  <Button
                    leftIcon="facebook"
                    contained
                    gap={ 12 }
                    onPress={ () => {
                      openURL('https://www.facebook.com/profile.php?id=100094088984930');
                    } }>
                    Facebook
                  </Button>
                </View>
              ) } />
            <ContextMenu
              dropdownMenuMode
              actions={ [
                {
                  onPress: () => openURL(`mailto:support@readless.ai?subject=Support Request&body=\n\n\n\n--- Please Do Not Edit Device Details Below ---\n\n${JSON.stringify(getUserAgent(), null, 2)}\n\n--- User Data ---\n\n${JSON.stringify(userData?.profile, null, 2)}`),
                  systemIcon: 'exclamationmark.triangle',
                  title: strings.reportAnIssue,
                },
                {
                  onPress: () => openURL(`mailto:ideas@readless.ai?subject=Idea for Read Less&body=\n\n\n\n--- Please Do Not Edit Device Details Below ---\n\n${JSON.stringify(getUserAgent(), null, 2)}\n\n--- User Data ---\n\n${JSON.stringify(userData?.profile, null, 2)}`),
                  systemIcon: 'lightbulb',
                  title: strings.suggestAFeature,  
                },
              ] }>
              <TableViewCell
                title={ strings.contactUs }
                cellIcon={ <Button leftIcon={ 'email' } /> }
                accessory="DisclosureIndicator" />
            </ContextMenu>
            <TableViewCell
              cellIcon={ <Button leftIcon="star" indicator={ !hasViewedFeature('app-review') } /> }
              accessory="DisclosureIndicator"
              title={ strings.leaveUsAReview }
              detail={ strings.howAreWeDoing }
              onPress={ () => {
                viewFeature('app-review');
                // TODO: send notification that user wrote review?
                openURL(Platform.select({ 
                  android: PLAY_STORE_LINK,
                  ios: APP_STORE_LINK, 
                }) ?? ''); 
              } } />
          </TableViewSection>
          <TableViewSection
            grouped
            header={ strings.about }>
            <TableViewCell 
              cellStyle='RightDetail'
              title={ strings.termsAndConditions }
              onPress={ () => {
                openURL('https://readless.ai/terms');
              } } />
            <TableViewCell 
              cellStyle='RightDetail'
              title={ strings.privacyPolicy }
              onPress={ () => {
                openURL('https://readless.ai/privacy');
              } } />
            <TableViewCell 
              cellStyle='RightDetail'
              title={ strings.version }
              detail={ getUserAgent().currentVersion } />
          </TableViewSection>
        </TableView>
      </ScrollView>
    </Screen>
  );
}