import React from 'react';
import { FlatList as RNFlatList, FlatListProps as RNFlatListProps } from 'react-native';

import { ChildlessViewProps } from '~/components';
import { useStyles } from '~/hooks';

export type FlatListProps<T> = RNFlatListProps<T> & ChildlessViewProps;

export function FlatList<T>(props: FlatListProps<T>) {
  const style = useStyles(props);
  return (
    <RNFlatList
      { ...props }
      style={ style } />
  );
}
