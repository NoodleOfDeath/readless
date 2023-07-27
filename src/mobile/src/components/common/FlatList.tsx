import React from 'react';

import { FlashList, FlashListProps } from '@shopify/flash-list';

import { ChildlessViewProps } from '~/components';
import { useStyles } from '~/hooks';

export type FlatListProps<T> = ChildlessViewProps & FlashListProps<T>;

export const FlatList = React.forwardRef(function FlatList<T>(
  props: FlatListProps<T>, 
  ref?: React.ForwardedRef<FlashList<T>>
) {
  const style = useStyles(props);
  return (
    <FlashList 
      ref={ ref }
      { ...props }
      style={ style } />
  );
}) as <T>(props: FlatListProps<T> & { ref?: React.ForwardedRef<FlashList<T>> }) => React.ReactElement;
