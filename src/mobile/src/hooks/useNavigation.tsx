import React from 'react';

import { useNavigation as useRNNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { PublicCategoryAttributes, PublicOutletAttributes } from '~/api';
import { StackableTabParams } from '~/screens';
import { readingFormat } from '~/utils';

export function useNavigation() {

  const navigation = useRNNavigation<NativeStackNavigationProp<StackableTabParams>>();

  const router = React.useCallback(({ url }: { url: string }) => {
    // http://localhost:6969/read/?s=158&f=casual
    // https://dev.readless.ai/read/?s=158&f=casual
    // https://www.readless.ai/read/?s=4070&f=bullets
    // readless://read/?s=4070
    const [path, query] = url.split('?');
    const expr = /^(?:readless|https?):\/\/(?:(?:dev|www\.)?readless\.ai\/)?(\w+)\/?/;
    const [, route] = path.match(expr) ?? [];
    const params: Record<string, string> = {};
    if (query) {
      query.split('&').forEach((pair) => {
        const [key, value] = pair.split('=');
        params[decodeURIComponent(key)] = decodeURIComponent(value || '');
      });
    }
    const summary = Number.parseInt(params['s'] ?? '0');
    if (!summary) {
      return;
    }
    const initialFormat = readingFormat(params['f']);
    if (route === 'read' && summary) {
      (navigation?.push ?? navigation.navigate)('summary', { initialFormat, summary });
    }
  }, [navigation]);

  const search = React.useCallback((params: StackableTabParams['search']) => {
    navigation?.push('search', params);
  }, [navigation]);

  const openOutlet = React.useCallback((outlet: PublicOutletAttributes) => {
    navigation?.push('search', { prefilter: `src:${outlet.name}` });
    //navigation?.navigate('outlet', { outlet });
  }, [navigation]);

  const openCategory = React.useCallback((category: PublicCategoryAttributes) => {
    navigation?.push('search', { prefilter: `cat:${category.name}` });
    //navigation?.navigate('category', { category });
  }, [navigation]);

  return {
    openCategory,
    openOutlet,
    router,
    search,
  };

}