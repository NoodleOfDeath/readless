import React from 'react';

import { Path, Svg } from 'react-native-svg';

import { IconProps } from '~/components';
import { TikTok } from '~/core/icons';
import { useTheme } from '~/hooks';

export const TikTokIcon = ({ size = 18 }: Partial<IconProps> = {}) => {
  const theme = useTheme();
  return (
    <Svg
      width={ size }
      height={ size } 
      viewBox={ TikTok.viewBox }>
      <Path
        d={ TikTok.path } 
        stroke={ theme.colors.text }
        fill={ theme.colors.text } />
    </Svg>
  );
};