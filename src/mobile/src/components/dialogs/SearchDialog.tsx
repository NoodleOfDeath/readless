import React from 'react';

import { SheetManager, SheetProps } from 'react-native-actions-sheet';

import { SearchMenu } from './SearchMenu';

import { ActionSheet, ChildlessViewProps } from '~/components';
import { strings } from '~/locales';

export type SearchMenuProps = ChildlessViewProps & {
  initialValue?: string;
  placeholder?: string;
  onChangeText?: (value: string) => void;
  onClear?: () => void;
  onSubmit?: (value: string) => void;
};

export function SearchDialog({
  payload,
  ...props
}: SheetProps<SearchMenuProps>) {

  const { 
    initialValue = '',
    placeholder = strings.search_title,
    onChangeText,
    onClear,
    onSubmit: onSubmit0,
  } = { ...payload };

  const onSubmit = React.useCallback((value: string) => {
    onSubmit0?.(value);
    SheetManager.hide(props.sheetId);
  }, [onSubmit0, props.sheetId]);

  return (
    <ActionSheet id={ props.sheetId }>
      <SearchMenu
        initialValue={ initialValue }
        placeholder={ placeholder }
        onChangeText={ onChangeText }
        onClear={ onClear }
        onSubmit={ onSubmit } />
    </ActionSheet>
  );
}