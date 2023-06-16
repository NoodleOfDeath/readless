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

  const { navigate } = useNavigation();
  const { bookmarkCount } = React.useContext(SessionContext);

  const items = React.useMemo(() => [
    {
      icon: 'cog',
      label: strings.menu_settings,
      onPress: async () => {
        await SheetManager.hide(props.sheetId);
        navigate('settings');
      },
    },
    {
      badge: bookmarkCount,
      icon: 'bookmark-outline',
      label: strings.menu_bookmarks,
      onPress: async () => {
        await SheetManager.hide(props.sheetId);
        navigate('bookmarks');
      },
    },
    {
      icon: 'bookshelf',
      label: strings.menu_browse,
      onPress: async () => {
        await SheetManager.hide(props.sheetId);
        navigate('browse');
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
      onPress: async () => {
        await SheetManager.hide(props.sheetId);
        navigate('about');
      },
    },
  ], [bookmarkCount, navigate, props.sheetId]);

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
              leftIcon={ (
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