import React from 'react';

import { useNavigation as useRNNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { 
  PublicCategoryAttributes, 
  PublicOutletAttributes,
  ReadingFormat,
} from '~/api';
import { SessionContext } from '~/contexts';
import { StackableTabParams } from '~/screens';
import { readingFormat } from '~/utils';

export function useNavigation() {

  const navigation = useRNNavigation<NativeStackNavigationProp<StackableTabParams>>();
  
  const { preferredReadingFormat, setPreference } = React.useContext(SessionContext);
  
  const navigate = React.useCallback(<R extends keyof StackableTabParams>(route: R, params?: StackableTabParams[R]) => {
    (navigation?.push ?? navigation.navigate)(route, params);
  }, [navigation]);

  const search = React.useCallback((params: StackableTabParams['search']) => {
    navigate('search', params);
    const searchText = params.prefilter;
    if (!searchText) {
      return;
    }
    setTimeout(() => setPreference('searchHistory', (prev) => Array.from(new Set([searchText, ...(prev ?? [])])).slice(0, 10)), 500);
  }, [navigate, setPreference]);
  
  const openSummary = React.useCallback((props: StackableTabParams['summary']) => {
    navigate('summary', {
      ...props,
      initialFormat: props.initialFormat ?? preferredReadingFormat ?? ReadingFormat.Summary,
    });
  }, [navigate, preferredReadingFormat]);

  const openOutlet = React.useCallback((outlet: PublicOutletAttributes) => {
    navigate('channel', { attributes: outlet, type: 'outlet' });
  }, [navigate]);

  const openCategory = React.useCallback((category: PublicCategoryAttributes) => {
    navigate('channel', { attributes: category, type: 'category' });
  }, [navigate]);

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
      openSummary({ initialFormat, summary });
    }
  }, [openSummary]);
  
  return {
    navigate,
    navigation,
    openCategory,
    openOutlet,
    openSummary,
    router,
    search,
  };

}