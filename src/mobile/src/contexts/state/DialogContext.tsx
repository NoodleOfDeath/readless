import React from 'react';
import { Linking, Platform } from 'react-native';

import { Portal, Provider } from 'react-native-paper';
import VersionCheck from 'react-native-version-check';

import { DEFAULT_DIALOG_CONTEXT } from './types';

import { PublicSummaryAttributes, ReleaseAttributes } from '~/api';
import {
  Button,
  Dialog,
  FeedBackDialog,
  ReleaseNotesCarousel,
  Text,
} from '~/components';
import { SessionContext } from '~/core/contexts';
import { useStatusClient } from '~/hooks';

export const DialogContext = React.createContext(DEFAULT_DIALOG_CONTEXT);

export function DialogContextProvider({ children }: React.PropsWithChildren) {

  const {
    ready, 
    preferences: { releases }, 
    setPreference, 
  } = React.useContext(SessionContext);
  const { getReleases } = useStatusClient();

  const [showFeedbackDialog, setShowFeedbackDialog] = React.useState<boolean>(false);
  const [feedbackSubject, setFeedbackSubject] = React.useState<PublicSummaryAttributes>();
  const [showReleaseNotes, setShowReleaseNotes] = React.useState<boolean>(false);
  const [releaseNotes, setReleaseNotes] = React.useState<ReleaseAttributes[]>([]);
  const [updateRequired, setUpdateRequired] = React.useState<boolean>(false);

  const handleReleaseNotesClose = React.useCallback(() => {
    setPreference('releases', (prev) => ({ ...prev }));
    setShowReleaseNotes(false);
  }, [setPreference]);

  const onMount = React.useCallback(async () => {
    const { data, error } = await getReleases();
    if (error) {
      console.error(error);
    } else if (data) {
      const onServerReleases = Object.fromEntries(data.rows
        .filter((release) => release.platform === Platform.OS)
        .map((release) => [release.version, release])) as Record<string, ReleaseAttributes>;
      const newReleases = Object.entries(onServerReleases)
        .filter(([version]) => !(releases ?? {})[version] && VersionCheck.getCurrentVersion() < version)
        .map(([, release]) => release);
      if (newReleases.length > 0) {
        if (newReleases.some((release) => release.options?.updateRequired === true)) {
          console.log('Force update required');
          setUpdateRequired(true);
          return;
        }
        setReleaseNotes(newReleases);
        setShowReleaseNotes(true);
        setPreference('releases', onServerReleases);
      }
    }
  }, [getReleases, releases, setPreference]);

  React.useEffect(() => {
    if (!ready) {
      return;
    }
    onMount();
    setShowReleaseNotes(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);
  
  return (
    <DialogContext.Provider value={ {
      feedbackSubject,
      releaseNotes,
      setFeedbackSubject,
      setReleaseNotes,
      setShowFeedbackDialog,
      setShowReleaseNotes,
      showFeedbackDialog,
      showReleaseNotes,
    } }>
      <Provider>
        {children}
        <Portal>
          {ready && showReleaseNotes && releaseNotes.length > 0 && (
            <ReleaseNotesCarousel 
              data={ releaseNotes } 
              onClose={ () => handleReleaseNotesClose() } />
          )}
          {updateRequired && (
            <Dialog
              visible
              title="Update Required"
              actions={ [
                <Button
                  p={ 8 }
                  outlined
                  rounded
                  key='update'
                  onPress={ () => {
                    if (Platform.OS === 'ios') {
                      Linking.openURL('https://apps.apple.com/us/app/read-less-news/id6447275859?itsct=apps_box_badge&itscg=30200');
                    } else if (Platform.OS === 'android') {
                      Linking.openURL('https://play.google.com/store/apps/details?id=com.readless');
                    }
                  } }>
                  Update Now
                </Button>,
              ] }>
              <Text>Sorry for being obnoxious and forcing you to update the app!</Text>
            </Dialog>
          )}
          {feedbackSubject && (
            <FeedBackDialog
              summary={ feedbackSubject }
              visible={ showFeedbackDialog }
              onClose={ () => setShowFeedbackDialog(false) } />
          )}
        </Portal>
      </Provider>
    </DialogContext.Provider>
  );
}
