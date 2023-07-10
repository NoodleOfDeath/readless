import React from 'react';
import { Linking } from 'react-native';

import { InAppBrowser } from 'react-native-inappbrowser-reborn';

import { useTheme } from '~/hooks';

export function useInAppBrowser() {

  const theme = useTheme();

  const openURL = React.useCallback(async (url: string, options?: Parameters<typeof InAppBrowser.open>[1]) => {
    try {
      if (await InAppBrowser.isAvailable()) {
        await InAppBrowser.open(url, {
          animated: true,
          animations: {
            endEnter: 'slide_in_left',
            endExit: 'slide_out_right',
            startEnter: 'slide_in_right',
            startExit: 'slide_out_left',
          },
          dismissButtonStyle: 'done',
          enableBarCollapsing: true,
          enableDefaultShare: true,
          enableUrlBarHiding: true,
          forceCloseOnRedirection: false,
          modalEnabled: true,
          modalPresentationStyle: 'popover',
          modalTransitionStyle: 'coverVertical',
          navigationBarColor: 'black',
          navigationBarDividerColor: 'white',
          preferredBarTintColor: theme.colors.primary,
          preferredControlTintColor: 'white',
          readerMode: true,
          secondaryToolbarColor: 'black',
          showTitle: true,
          toolbarColor: '#6200EE',
          ...options,
        });
      } else {
        Linking.openURL(url);
      }
    } catch (error) {
      Linking.openURL(url);
    }
  }, [theme.colors.primary]);

  return { openURL };

}