import React from 'react';

import { FlashList, FlashListProps } from '@shopify/flash-list';

export type FlatListProps<T> = FlashListProps<T>;

export const FlatList = React.forwardRef(function FlatList<T>(
  props: FlatListProps<T>, 
  ref?: React.ForwardedRef<FlashList<T>>
) {
  return (
    <FlashList ref={ ref } { ...props } />
  );
}) as <T>(props: FlatListProps<T> & { ref?: React.ForwardedRef<FlashList<T>> }) => React.ReactElement;
