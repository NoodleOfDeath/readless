import Orientation, { OrientationType } from 'react-native-orientation-locker';

export type LayoutContextType = {
  screenHeight: number;
  screenWidth: number;
  scale: number;
  fontScale: number;
  supportsMasterDetail: boolean;
  isTablet: boolean;
  orientation: OrientationType;
  lockRotation: (orientation?: OrientationType) => void;
  unlockRotation: () => void;
};

export const DEFAULT_LAYOUT_CONTEXT: LayoutContextType = {
  fontScale: 0,
  isTablet: false, 
  lockRotation: () => Promise.resolve(), 
  orientation: Orientation.getInitialOrientation(), 
  scale: 0,
  screenHeight: 0,
  screenWidth: 0,
  supportsMasterDetail: false,
  unlockRotation: () => Promise.resolve(),
};
