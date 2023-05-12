import React from 'react';
import { Dimensions, ScaledSize } from 'react-native';

type Orientation = 'portrait' | 'landscape';

export function useLayout(){

  const [orientation, setOrientation] = React.useState<Orientation>('portrait');
  const [dimensions, setDimensions] = React.useState<ScaledSize>();

  const supportsMasterDetail = React.useMemo(() => Boolean(dimensions?.width && dimensions.width > 768), [dimensions?.width]);

  React.useEffect(() => {
    const subscriber = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
      if (window.width < window.height) {
        setOrientation('portrait');
      } else {
        setOrientation('landscape');
      }
    });
    return () => subscriber.remove();
  }, []);

  return {
    dimensions, orientation, supportsMasterDetail, 
  };

}