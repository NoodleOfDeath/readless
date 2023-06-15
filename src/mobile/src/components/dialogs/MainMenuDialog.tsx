import React from 'react';

import { SheetManager, SheetProps } from 'react-native-actions-sheet';
import { Badge } from 'react-native-paper';

import {
  ActionSheet,
  Button,
  Divider,
  Icon,
  View,
} from '~/components';
import { SessionContext } from '~/core';
import { useNavigation } from '~/hooks';
import { strings } from '~/locales';

export function MainMenuDialog(props: SheetProps) {

  const {
    openAbout, openBookmarks, openBrowse, openSettings, openWalkthroughs,
  } = useNavigation();
  const { bookmarkCount } = React.useContext(SessionContext);

  const items = React.useMemo(() => [
    {
      icon: 'cog',
      label: strings.menu_settings,
      onPress: async () => {
        await SheetManager.hide(props.sheetId);
        openSettings();
      },
    },
    {
      badge: bookmarkCount,
      icon: 'bookmark-outline',
      label: strings.menu_bookmarks,
      onPress: async () => {
        await SheetManager.hide(props.sheetId);
        openBookmarks();
      },
    },
    {
      icon: 'bookshelf',
      label: strings.menu_browse,
      onPress: async () => {
        await SheetManager.hide(props.sheetId);
        openBrowse();
      },
    },
    {
      icon: 'map-legend',
      label: strings.menu_walkthroughs,
      onPress: async () => {
        await SheetManager.hide(props.sheetId);
        await SheetManager.show('onboarding-walkthrough'); 
      },
    },
    {
      icon: 'information',
      label: strings.menu_about,
      onPress: openAbout,
    },
  ], [bookmarkCount, openAbout, openBookmarks, openBrowse, openSettings, props.sheetId]);

  return (
    <ActionSheet id={ props.sheetId }>
      <View p={ 12 }>
        {items.map(({
          badge, icon, label, onPress, 
        }, i) => (
          <View key={ i }>
            <Button
              touchable
              horizontal
              p={ 12 }
              gap={ 12 }
              h6
              startIcon={ (
                <View>
                  {badge !== undefined && badge > 0 && (
                    <Badge
                      size={ 18 }
                      style={ {
                        position: 'absolute', right: -5, top: -5, zIndex: 1,
                      } }>
                      {badge}
                    </Badge>
                  )}
                  <Icon name={ icon } />
                </View>
              ) }
              onPress={ onPress }>
              {label}
            </Button>
            {i < items.length - 1 && (
              <Divider />
            )}
          </View>
        ))}
      </View>
    </ActionSheet>
  );
}