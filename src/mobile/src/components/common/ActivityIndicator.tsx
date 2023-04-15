import React from 'react';
import { ActivityIndicator as RNActivityIndicator } from 'react-native';

import { useTheme } from '~/hooks';

type ActivityIndicatorProps = React.ComponentProps<typeof RNActivityIndicator>;

export function ActivityIndicator(props: ActivityIndicatorProps) {
  const theme = useTheme();

  return (
    <RNActivityIndicator
      animating
      color={ theme.colors.primary }
      { ...props } />
  );
}
