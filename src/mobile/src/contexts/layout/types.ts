import { ScaledSize } from 'react-native';

import Orientation, { OrientationType } from 'react-native-orientation-locker';

export type LayoutContextType = {
  dimensions?: ScaledSize;
  supportsMasterDetail: boolean;
  isTablet: boolean;
  orientation: OrientationType;
  rotationLock?: OrientationType;
  setRotationLock: React.Dispatch<React.SetStateAction<OrientationType | undefined>>;
  lockRotation(): void;
  unlockRotation(): void;
};

export const DEFAULT_LAYOUT_CONTEXT: LayoutContextType = {
  isTablet: false,
  lockRotation: () => {
    // placeholder
  },
  orientation: Orientation.getInitialOrientation(),
  setRotationLock: () => {
    // placeholder
  },
  supportsMasterDetail: false,
  unlockRotation: () => {
    // placeholder
  },
};
