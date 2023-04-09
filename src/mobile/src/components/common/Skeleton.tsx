import React from 'react';

import { Skeleton as RNSkeleton, SkeletonProps as RNSkeletonProps } from '@rneui/base';

import { View, ViewProps } from '~/components';
import { useStyles } from '~/hooks';

export type SkeletonProps = RNSkeletonProps & ViewProps;

export function Skeleton(props: SkeletonProps) {
  const style = useStyles(props);
  return (
    <View style={ style }>
      <RNSkeleton { ...props } />
    </View>
  );
}