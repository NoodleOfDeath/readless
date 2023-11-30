import React from 'react';
import { Platform } from 'react-native';

import { APP_STORE_LINK, PLAY_STORE_LINK } from '@env';

import { ScreenComponent } from '../types';

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
import { useInAppBrowser } from '~/hooks';
import { TikTokIcon } from '~/icons';
import { strings } from '~/locales';
import { usePlatformTools } from '~/utils';

export function SettingsScreen({
  route: _route,
  navigation,
}: ScreenComponent<'settings'>) {

  const { openURL } = useInAppBrowser();
  const { getUserAgent } = usePlatformTools();

  const {
    followedPublishers,
    followedCategories,
    userData, 
    viewFeature,
    hasViewedFeature,
  } = React.useContext(StorageContext);

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
              onPress={ () => navigation?.push('account') } />
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
                navigation?.push('displayPreferences');
              } } />
            <TableViewCell 
              cellIcon={ <Button leftIcon="pen" indicator={ !hasViewedFeature('publishers') } /> }
              cellStyle="RightDetail"
              title={ strings.publishers }
              accessory="DisclosureIndicator"
              detail={ `${Object.keys(followedPublishers ?? {}).length ?? 0} ${strings.following}` }
              onPress={ () =>{
                viewFeature('publishers');
                navigation?.push('publisherPicker'); 
              } } />
            <TableViewCell 
              cellIcon={ <Button leftIcon="bucket" indicator={ !hasViewedFeature('categories') } /> }
              title={ strings.categories }
              accessory="DisclosureIndicator"
              detail={ `${Object.keys(followedCategories ?? {}).length ?? 0} ${strings.following}` }
              onPress={ () => {
                viewFeature('categories');
                navigation?.push('categoryPicker'); 
              } } />
            <TableViewCell
              devOnly
              cellIcon={ (
                <Button
                  leftIcon="cog" />
              ) }
              accessory="DisclosureIndicator"
              title={ strings.manage }
              onPress={ () => {
                navigation?.push('generalSettings');
              } } />
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
                navigation?.push('notificationSettings');
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
                openURL(Platform.select({ android: PLAY_STORE_LINK, ios: APP_STORE_LINK }) ?? ''); 
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