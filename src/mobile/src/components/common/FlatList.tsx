import React from 'react';

import { FlashList, FlashListProps } from '@shopify/flash-list';

export type FlatListProps<T> = FlashListProps<T>;

export function FlatList<T>(props: FlatListProps<T>) {
  return (
    <FlashList { ...props } />
  );
}
