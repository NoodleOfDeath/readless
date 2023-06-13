import React from 'react';

import { SheetProps } from 'react-native-actions-sheet';
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
      label: strings.settings.settings,
      onPress: openSettings,
    },
    {
      badge: bookmarkCount,
      icon: 'bookmark-outline',
      label: strings.bookmarks.bookmarks,
      onPress: openBookmarks,
    },
    {
      icon: 'bookshelf',
      label: strings.browse,
      onPress: openBrowse,
    },
    {
      icon: 'map-legend',
      label: strings.walkthroughs,
      onPress: openWalkthroughs,
    },
    {
      icon: 'information',
      label: strings.about,
      onPress: openAbout,
    },
  ], [bookmarkCount, openAbout, openBookmarks, openBrowse, openSettings, openWalkthroughs]);

  return (
    <ActionSheet id={ props.sheetId }>
      <View p={ 12 }>
        {items.map(({
          badge, icon, label, onPress, 
        }, i) => (
          <View key={ i }>
            <Button
              horizontal
              p={ 12 }
              gap={ 12 }
              h3
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