import React from 'react';
import { Dimensions, ScaledSize } from 'react-native';

import Orientation, { OrientationType } from 'react-native-orientation-locker';

import { DEFAULT_LAYOUT_CONTEXT } from './types';

export const LayoutContext = React.createContext(DEFAULT_LAYOUT_CONTEXT);

export function LayoutContextProvider({ children }: React.PropsWithChildren) {
  
  const [orientation, setOrientation] = React.useState<OrientationType>(Orientation.getInitialOrientation());
  const [dimensions, setDimensions] = React.useState<ScaledSize>();
  const [rotationLock, setRotationLock] = React.useState(false);
  
  const supportsMasterDetail = React.useMemo(() => (dimensions?.width ?? Dimensions.get('window').width) > 768, [dimensions?.width]);

  React.useEffect(() => {
    if (!rotationLock) {
      Orientation.unlockAllOrientations();
    } else {
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
        break;
      }
    }
  }, [orientation, rotationLock]);
  
  React.useEffect(() => {
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
      orientation,
      rotationLock,
      setRotationLock,
      supportsMasterDetail,
    } }>
      {children}
    </LayoutContext.Provider>
  );
  
}