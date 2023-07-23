import { ScaledSize } from 'react-native';

import Orientation, { OrientationType } from 'react-native-orientation-locker';

export type LayoutContextType = {
  dimensions?: ScaledSize;
  supportsMasterDetail: boolean;
  isTablet: boolean;
  orientation: OrientationType;
  lockRotation: (orientation?: OrientationType) => void;
  unlockRotation: () => void;
};

export const DEFAULT_LAYOUT_CONTEXT: LayoutContextType = {
  isTablet: false,
  lockRotation: () => Promise.resolve(),
  orientation: Orientation.getInitialOrientation(),
  supportsMasterDetail: false,
  unlockRotation: () => Promise.resolve(),
};
