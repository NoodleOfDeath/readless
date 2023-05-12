import React from 'react';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { PublicCategoryAttributes, PublicOutletAttributes } from '~/api';
import { StackableTabParams } from '~/screens';

export function useSearch() {

  const navigation = useNavigation<NativeStackNavigationProp<StackableTabParams>>();

  const search = React.useCallback((params: StackableTabParams['search']) => {
    navigation?.navigate('search', params);
  }, [navigation]);

  const openOutlet = React.useCallback((outlet: PublicOutletAttributes) => {
    navigation?.navigate('outlet', { outlet });
  }, [navigation]);

  const openCategory = React.useCallback((category: PublicCategoryAttributes) => {
    navigation?.navigate('category', { category });
  }, [navigation]);

  return {
    openCategory, 
    openOutlet, 
    search,
  };

}