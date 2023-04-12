import React from 'react';
import { Image, Platform } from 'react-native';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { DEFAULT_APP_STATE_CONTEXT } from './types';

import { PublicSummaryAttributes } from '~/api';
import {
  FeedBackDialog,
  Icon,
  LoginAction,
  LoginDialog,
  LoginDialogProps,
  NotFollowingDialog,
  ReleaseNotesDialog,
  Text,
  View,
} from '~/components';
import { SessionContext } from '~/core/contexts';
import { useStatusClient, useTheme } from '~/hooks';
import { StackableTabParams } from '~/screens';

export const AppStateContext = React.createContext(DEFAULT_APP_STATE_CONTEXT);

export function AppStateContextProvider({ children }: React.PropsWithChildren) {

  const {
    ready, 
    preferences: { lastReleaseNotesDate }, 
    setPreference, 
  } = React.useContext(SessionContext);
  const { isLightMode } = useTheme();
  const { getReleases } = useStatusClient();

  const [showLoginDialog, setShowLoginDialog] = React.useState<boolean>(false);
  const [loginDialogProps, setLoginDialogProps] = React.useState<LoginDialogProps>();
  const [showNotFollowingDialog, setShowNotFollowingDialog] = React.useState<boolean>(false);
  const [showFeedbackDialog, setShowFeedbackDialog] = React.useState<boolean>(false);
  const [feedbackSubject, setFeedbackSubject] = React.useState<PublicSummaryAttributes>();
  const [deferredAction, setDeferredAction] = React.useState<() => void>();
  const [showReleaseNotes, setShowReleaseNotes] = React.useState<boolean>(false);
  const [navigation, setNavigation] = React.useState<NativeStackNavigationProp<StackableTabParams, keyof StackableTabParams>>();

  const handleReleaseNotesClose = React.useCallback(() => {
    setPreference('lastReleaseNotesDate', String(new Date().valueOf()));
    setShowReleaseNotes(false);
  }, [setPreference]);

  const handleLoginSuccess = React.useCallback((action: LoginAction) => {
    if (action === 'logIn') {
      setShowLoginDialog(false);
    }
  }, []);
  
  React.useEffect(() => {
    if (!showLoginDialog) {
      setLoginDialogProps(undefined);
    }
  }, [showLoginDialog]);

  const onMount = React.useCallback(async () => {
    const { data, error } = await getReleases();
    if (error) {
      console.error(error);
    } else if (data) {
      const releases = data.rows
        .filter((release) => release.platform === Platform.OS)
        .sort((a, b) => new Date(a.createdAt ?? 0).valueOf() - new Date(b.createdAt ?? 0).valueOf());
      if (!lastReleaseNotesDate || (releases.length > 0 && new Date(lastReleaseNotesDate).valueOf() < new Date(releases[releases.length - 1].createdAt ?? 0).valueOf())) {
        setShowReleaseNotes(true);
        setPreference('lastReleaseNotesDate', releases.length > 0 ? new Date(releases[releases.length - 1].createdAt ?? Date.now()).valueOf().toString() : String(new Date().valueOf()));
      }
    }
  }, [getReleases, lastReleaseNotesDate, setPreference]);

  React.useEffect(() => {
    if (!ready) {
      return;
    }
    onMount();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  const transformAsset = (asset: string, ext = 'jpg') => {
    if (Platform.OS === 'ios') {
      return asset;
    }
    return `asset:/images/${asset}.${ext}`;
  };
  
  const releaseNotesData = React.useMemo(() => [
    {
      content: (
        <View col justifyCenter>
          <Text 
            center
            fontSize={ 24 }
            color='contrastText'>
            Read Less uses generative AI to summarize news into shorter formats!
          </Text>
          <View alignCenter justifyCenter mv={ 8 }>
            <Image 
              source={ { uri: transformAsset(!isLightMode ? 'GuideReadingFormatDark' : 'GuideReadingFormatLight') } } 
              style={ { aspectRatio: 1, width: '80%' } } />
          </View>
          <Text
            center
            fontSize={ 24 }
            color='contrastText'
            mb={ 16 }>
            You can set your preferred reading format in settings
          </Text>
          <Text
            center
            fontSize={ 20 }
            color='contrastText'>
            Swipe this card to continue
            <Icon name='arrow-right' color='contrastText' fontSize={ 24 } />
          </Text>
        </View>
      ),
    },
    {
      content: (
        <View col justifyCenter>
          <Text 
            center
            fontSize={ 24 }
            color='contrastText'>
            No time to read now?
          </Text>
          <View alignCenter justifyCenter mv={ 8 }>
            <Image 
              source={ { uri: transformAsset(!isLightMode ? 'GuideBookmarkDark' : 'GuideBookmarkLight') } } 
              style={ { aspectRatio: 1, width: '80%' } } />
          </View>
          <Text
            center
            fontSize={ 24 }
            color='contrastText'
            mb={ 16 }>
            Bookmark it, then read offline 
            under &apos;My Stuff&apos;
          </Text>
          <Text
            center
            fontSize={ 20 }
            color='contrastText'>
            I promise, only 2 more cards...
            <Icon name='arrow-right' color='contrastText' fontSize={ 24 } />
          </Text>
        </View>
      ),
    },
    {
      content: (
        <View col justifyCenter>
          <Text 
            center
            fontSize={ 24 }
            color='contrastText'>
            A.I. is not infallible.
          </Text>
          <View alignCenter justifyCenter mv={ 8 }>
            <Image 
              source={ { uri: transformAsset(!isLightMode ? 'GuideViewSourceDark' : 'GuideViewSourceLight') } } 
              style={ { aspectRatio: 4/3, width: '80%' } } />
          </View>
          <Text
            center
            fontSize={ 24 }
            color='contrastText'
            mb={ 8 }>
            It is important to always DYOR. Original sources are always included.
          </Text>
          <Text
            center
            color='contrastText'
            mb={ 16 }>
            (but if we can help you avoid clickbait that&apos;s a plus!)
          </Text>
          <Text
            center
            fontSize={ 20 }
            color='contrastText'>
            Just one more!
            <Icon name='arrow-right' color='contrastText' fontSize={ 24 } />
          </Text>
        </View>
      ),
    },
    {
      content: (
        <View col justifyCenter>
          <Text 
            center
            fontSize={ 24 }
            color='contrastText'>
            As a totally free app, we hope you can be patient with updates!
          </Text>
          <Text
            center
            fontSize={ 24 }
            color='contrastText'
            mb={ 8 }>
            We welcome any feedback! You can email your ideas to
          </Text>
          <Text
            center
            fontSize={ 24 }
            color='#aaaaff'
            mb={ 16 }>
            feedback@readless.ai
          </Text>
          <Text
            center
            fontSize={ 20 }
            color='contrastText'>
            Last one!
            <Icon name='arrow-right' color='contrastText' fontSize={ 24 } />
          </Text>
        </View>
      ),
    },
    { content: <div></div> },
  ], [isLightMode]);
  
  return (
    <AppStateContext.Provider value={ {
      deferredAction,
      feedbackSubject,
      loginDialogProps,
      navigation,
      setDeferredAction,
      setFeedbackSubject,
      setLoginDialogProps,
      setNavigation,
      setShowFeedbackDialog,
      setShowLoginDialog,
      setShowNotFollowingDialog,
      showFeedbackDialog,
      showLoginDialog,
      showNotFollowingDialog,
    } }>
      {children}
      {showReleaseNotes && <ReleaseNotesDialog data={ releaseNotesData } onClose={ () => handleReleaseNotesClose() } />}
      <NotFollowingDialog
        visible={ showNotFollowingDialog }
        navigation={ navigation }
        onClose={ () => setShowNotFollowingDialog(false) } />
      {feedbackSubject && (
        <FeedBackDialog
          summary={ feedbackSubject }
          visible={ showFeedbackDialog }
          onClose={ () => setShowFeedbackDialog(false) } />
      )}
      <LoginDialog 
        visible={ showLoginDialog }
        onClose={ () => setShowLoginDialog(false) }
        onSuccess={ (action) => handleLoginSuccess(action) }
        { ...loginDialogProps } />
    </AppStateContext.Provider>
  );
}
