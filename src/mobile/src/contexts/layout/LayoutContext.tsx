import React from 'react';
import { Dimensions, ScaledSize } from 'react-native';

import Orientation, { OrientationType } from 'react-native-orientation-locker';

import { DEFAULT_LAYOUT_CONTEXT } from './types';

import { SessionContext } from '~/contexts';

export const LayoutContext = React.createContext(DEFAULT_LAYOUT_CONTEXT);

export function LayoutContextProvider({ children }: React.PropsWithChildren) {
  
  const {
    rotationLock: initialRotationLock, 
    setPreference,
  } = React.useContext(SessionContext);
  
  const [orientation, setOrientation] = React.useState<OrientationType>(Orientation.getInitialOrientation());
  const [dimensions, setDimensions] = React.useState<ScaledSize>();
  const [rotationLock, setRotationLock] = React.useState<OrientationType | undefined>(initialRotationLock);
  
  const isTablet = React.useMemo(() => (dimensions?.width ?? Dimensions.get('window').width) > 1024, [dimensions?.width]);
  const supportsMasterDetail = React.useMemo(() => (dimensions?.width ?? Dimensions.get('window').width) > 768, [dimensions?.width]);

  const lockRotation = React.useCallback(() => {
    switch (orientation) {
    case 'LANDSCAPE-LEFT':
      Orientation.lockToLandscapeLeft();
      break;
    case 'LANDSCAPE-RIGHT':
      Orientation.lockToLandscapeRight();
      break;
    case 'PORTRAIT':
    case 'PORTRAIT-UPSIDEDOWN':
      Orientation.lockToPortrait();
      break;
    default:
      Orientation.unlockAllOrientations();
      setPreference('rotationLock', undefined);
      return;
    }
    setRotationLock(orientation);
    setPreference('rotationLock', orientation);
  }, [orientation, setPreference]);
  
  const unlockRotation = React.useCallback(() => {
    Orientation.unlockAllOrientations();
    setRotationLock(undefined);
    setPreference('rotationLock', undefined);
  }, [setPreference]);
  
  React.useEffect(() => {
    Orientation.unlockAllOrientations();
    const subscriber = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });
    Orientation.addOrientationListener(setOrientation);
    return () => {
      subscriber.remove();
      Orientation.removeOrientationListener(setOrientation);
    };
  }, []);
  
  return (
    <LayoutContext.Provider value={ {
      dimensions,
      isTablet,
      lockRotation,
      orientation,
      rotationLock,
      setRotationLock,
      supportsMasterDetail,
      unlockRotation,
    } }>
      {children}
    </LayoutContext.Provider>
  );
  
}