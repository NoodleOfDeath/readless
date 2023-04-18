import React from 'react';
import { Dimensions } from 'react-native';

type Orientation = 'portrait' | 'landscape';

export function useOrientation(){
  const [orientation, setOrientation] = React.useState<Orientation>('portrait');
  React.useEffect(() => {
    Dimensions.addEventListener('change', ({ window:{ width, height } })=>{
      if (width<height) {
        setOrientation('portrait');
      } else {
        setOrientation('landscape');
    
      }
    });
  }, []);
  return orientation;
}