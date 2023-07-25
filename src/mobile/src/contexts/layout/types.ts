import { ScaledSize } from 'react-native';

import Orientation, { OrientationType } from 'react-native-orientation-locker';

export type LayoutContextType = {
  dimensions: ScaledSize;
  supportsMasterDetail: boolean;
  isTablet: boolean;
  orientation: OrientationType;
  lockRotation: (orientation?: OrientationType) => void;
  unlockRotation: () => void;
};

export const DEFAULT_LAYOUT_CONTEXT: LayoutContextType = {
  dimensions: {
    fontScale: 0, height: 0, scale: 0, width: 0, 
  },
  isTablet: false,
  lockRotation: () => Promise.resolve(),
  orientation: Orientation.getInitialOrientation(),
  supportsMasterDetail: false,
  unlockRotation: () => Promise.resolve(),
};
