import React from 'react';
import { Linking, Platform } from 'react-native';

import { Portal, Provider } from 'react-native-paper';
import VersionCheck from 'react-native-version-check';

import { DEFAULT_DIALOG_CONTEXT } from './types';

import { ReleaseAttributes } from '~/api';
import {
  Button,
  Dialog,
  FeedBackDialog,
  FeedBackDialogProps,
  ReleaseNotesCarousel,
  ShareFab,
  ShareFabProps,
  Text,
} from '~/components';
import { SessionContext } from '~/core/contexts';
import { useStatusClient, useSummaryClient } from '~/hooks';

export const DialogContext = React.createContext(DEFAULT_DIALOG_CONTEXT);

export function DialogContextProvider({ children }: React.PropsWithChildren) {

  const {
    ready, 
    preferences: { releases }, 
    setPreference, 
  } = React.useContext(SessionContext);
  const { getReleases } = useStatusClient();
  const { handleInteraction } = useSummaryClient();

  const [showReleaseNotes, setShowReleaseNotesRaw] = React.useState<boolean>(false);
  const [releaseNotes, setReleaseNotes] = React.useState<ReleaseAttributes[]>([]);
  const [updateRequired, setUpdateRequired] = React.useState<boolean>(false);
  const [showShareFab, setShowShareFabRaw] = React.useState<boolean>(false);
  const [shareFabOptions, setShareFabOptions] = React.useState<ShareFabProps>();
  const [showFeedbackDialog, setShowFeedbackDialogRaw] = React.useState<boolean>(false);
  const [feedbackOptions, setFeedbackOptions] = React.useState<FeedBackDialogProps>();

  const setShowReleaseNotes = React.useCallback((state: boolean | ((prev: boolean) => boolean), options: ReleaseAttributes[] = []) => {
    setShowReleaseNotesRaw(state);
    setReleaseNotes(options);
  }, []);

  const setShowShareFab = React.useCallback((state: boolean | ((prev: boolean) => boolean), options?: ShareFabProps) => {
    setShowShareFabRaw(state);
    setShareFabOptions(options);
  }, []);

  const setShowFeedbackDialog = React.useCallback((state: boolean | ((prev: boolean) => boolean), options?: FeedBackDialogProps) => {
    setShowFeedbackDialogRaw(state);
    setFeedbackOptions(options);
  }, []);

  const handleReleaseNotesClose = React.useCallback(() => {
    setPreference('releases', (prev) => ({ ...prev }));
    setShowReleaseNotes(false);
  }, [setPreference, setShowReleaseNotes]);

  const onMount = React.useCallback(async () => {
    const { data, error } = await getReleases();
    if (error) {
      console.error(error);
    } else if (data) {
      const onServerReleases = Object.fromEntries(data.rows
        .filter((release) => release.platform === Platform.OS)
        .map((release) => [release.version, release])) as Record<string, ReleaseAttributes>;
      const newReleases = Object.entries(onServerReleases)
        .filter(([version]) => !(releases ?? {})[version] && VersionCheck.getCurrentVersion() <= version)
        .map(([, release]) => release);
      if (newReleases.length > 0) {
        if (newReleases.some((release) => release.options?.updateRequired === true)) {
          console.log('Force update required');
          setUpdateRequired(true);
          return;
        }
        setShowReleaseNotes(true, newReleases);
        setPreference('releases', onServerReleases);
      }
    }
  }, [getReleases, releases, setPreference, setShowReleaseNotes]);

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
      setShowFeedbackDialog,
      setShowReleaseNotes,
      setShowShareFab,
      showFeedbackDialog,
      showReleaseNotes,
      showShareFab,
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
          <ShareFab
            { ...shareFabOptions }
            open={ showShareFab }
            visible={ showShareFab }
            onInteract={ (...args) => shareFabOptions?.summary && handleInteraction(shareFabOptions.summary, ...args) }
            onDismiss={ () => setShowShareFab(false) } />
          {feedbackOptions && showFeedbackDialog && (
            <FeedBackDialog
              { ...feedbackOptions }
              visible={ showFeedbackDialog }
              onClose={ () => setShowFeedbackDialog(false) } />
          )}
        </Portal>
      </Provider>
    </DialogContext.Provider>
  );
}
