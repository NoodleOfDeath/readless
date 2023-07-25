import React from 'react';
import { useWindowDimensions } from 'react-native';

import Orientation, { OrientationType } from 'react-native-orientation-locker';

import { DEFAULT_LAYOUT_CONTEXT } from './types';

export const LayoutContext = React.createContext(DEFAULT_LAYOUT_CONTEXT);

export function LayoutContextProvider({ children }: React.PropsWithChildren) {
  
  const [orientation, setOrientation] = React.useState<OrientationType>(Orientation.getInitialOrientation());
  const dimensions = useWindowDimensions();
  
  const isTablet = React.useMemo(() => dimensions.width >= 1024, [dimensions.width]);
  const supportsMasterDetail = React.useMemo(() => dimensions.width > 1024, [dimensions?.width]);

  const lockRotation = React.useCallback((newOrientaion?: OrientationType) => {
    switch (newOrientaion ?? orientation) {
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
      return;
    }
    if (newOrientaion) {
      setOrientation(newOrientaion);
    }
  }, [orientation]);
  
  const unlockRotation = React.useCallback(() => {
    Orientation.unlockAllOrientations();
  }, []);
  
  React.useEffect(() => {
    Orientation.unlockAllOrientations();
    Orientation.addOrientationListener(setOrientation);
    return () => {
      Orientation.removeOrientationListener(setOrientation);
    };
  }, []);
  
  return (
    <LayoutContext.Provider value={ {
      dimensions,
      isTablet,
      lockRotation,
      orientation,
      supportsMasterDetail,
      unlockRotation,
    } }>
      {children}
    </LayoutContext.Provider>
  );
  
}