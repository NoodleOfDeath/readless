import React from 'react';

import { useFocusEffect } from '@react-navigation/native';
import { FlashList, FlashListProps } from '@shopify/flash-list';

import {
  AuthError,
  HttpResponse,
  InternalError,
  RequestParams,
} from '~/api';
import { ChildlessViewProps } from '~/components';

export type BulkResponse<T> = {
  rows: T[];
};

export type FlatListProps<T> = ChildlessViewProps & FlashListProps<T>;

export const FlatList = React.forwardRef(function FlatList<T>(
  props: FlatListProps<T>, 
  ref?: React.ForwardedRef<FlashList<T>>
) {
  return (
    <FlashList 
      ref={ ref }
      { ...props } />
  );
}) as <T>(props: FlatListProps<T> & { ref?: React.ForwardedRef<FlashList<T>> }) => React.ReactElement;

export type FetchableListProps<T> = ChildlessViewProps & FlashListProps<T> & {
  autofetch?: boolean;
  fallbackComponent?: React.ReactNode;
  fetch: (params?: RequestParams) => Promise<HttpResponse<BulkResponse<T>, AuthError | InternalError> | T[]>;
  onFetch?: (data: T[]) => void;
  onError?: (err: AuthError | InternalError | unknown) => void;
};

export const FetchableList = React.forwardRef(function FetchableList<T>(
  {
    autofetch,
    fallbackComponent,
    fetch,
    onFetch,
    onError,
    data: initialData,
    ...props
  }: FetchableListProps<T>, 
  ref?: React.ForwardedRef<FlashList<T>>
) {

  const [data, setData] = React.useState(initialData ?? []);
  const [refreshing, setRefreshing] = React.useState(false);

  const onMount = React.useCallback(async (autofetch = false) => {
    if (!autofetch || refreshing) {
      return;
    }
    setRefreshing(true);
    try {
      const response = await fetch();
      if (Array.isArray(response)) {
        setData(response);
        onFetch?.(response);
      } else {
        setData(response.data.rows);
        onFetch?.(response.data.rows);
      }
    } catch (e) {
      console.error(e);
      onError?.(e);
    } finally {
      setRefreshing(false);
    }
  }, [fetch, onFetch, onError, refreshing]);

  useFocusEffect(React.useCallback(() => {
    onMount(autofetch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autofetch]));

  if (data.length === 0) {
    return fallbackComponent;
  }

  return (
    <FlatList
      ref={ ref }
      refreshing={ refreshing }
      onRefresh={ () => onMount(true) }
      { ...props }
      data={ data } />
  );
}) as <T>(props: FetchableListProps<T> & { ref?: React.ForwardedRef<FlashList<T>> }) => React.ReactElement;