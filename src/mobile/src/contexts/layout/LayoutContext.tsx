import React from 'react';
import { Keyboard, useWindowDimensions } from 'react-native';

import Orientation, { OrientationType } from 'react-native-orientation-locker';

import { DEFAULT_LAYOUT_CONTEXT } from './types';

export const LayoutContext = React.createContext(DEFAULT_LAYOUT_CONTEXT);

export function LayoutContextProvider({ children }: React.PropsWithChildren) {
  
  const [orientation, setOrientation] = React.useState<OrientationType>(Orientation.getInitialOrientation());
  const {
    width: screenWidth, height: screenHeight, scale, fontScale,
  } = useWindowDimensions();
  const [keyboardHeight, setKeyboardHeight] = React.useState(0);
  
  const isTablet = React.useMemo(() => screenWidth >= 1024, [screenWidth]);
  const supportsMasterDetail = React.useMemo(() => screenWidth > 1200, [screenWidth]);

  React.useEffect(() => {
    const keyboardWillShow = Keyboard.addListener('keyboardWillShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const keyboardDidHide = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });
    return () => {
      keyboardWillShow.remove();
      keyboardDidHide.remove();
    };
  }, []);

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
      fontScale,
      isTablet,
      keyboardHeight,
      lockRotation,
      orientation,
      scale,
      screenHeight,
      screenWidth,
      supportsMasterDetail,
      unlockRotation,
    } }>
      {children}
    </LayoutContext.Provider>
  );
  
}