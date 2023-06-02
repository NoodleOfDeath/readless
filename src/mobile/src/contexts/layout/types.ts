import { ScaledSize } from 'react-native';

import Orientation, { OrientationType } from 'react-native-orientation-locker';

export type LayoutContextType = {
  dimensions?: ScaledSize;
  supportsMasterDetail: boolean;
  orientation: OrientationType;
  rotationLock: boolean;
  setRotationLock: React.Dispatch<React.SetStateAction<boolean>>;
};

export const DEFAULT_LAYOUT_CONTEXT: LayoutContextType = {
  orientation: Orientation.getInitialOrientation(),
  rotationLock: false,
  setRotationLock: () => {
    // placeholder
  },
  supportsMasterDetail: false,
};
