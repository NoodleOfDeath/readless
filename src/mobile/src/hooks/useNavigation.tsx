import React from 'react';

import { useNavigation as useRNNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { 
  PublicCategoryAttributes, 
  PublicPublisherAttributes,
  ReadingFormat,
} from '~/api';
import { SessionContext } from '~/contexts';
import { RoutingParams } from '~/screens';
import { readingFormat, usePlatformTools } from '~/utils';

export function useNavigation() {

  const { emitEvent } = usePlatformTools();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navigation = useRNNavigation<NativeStackNavigationProp<RoutingParams>>();
  
  const { preferredReadingFormat, setPreference } = React.useContext(SessionContext);

  const navigate = React.useCallback(<R extends keyof RoutingParams>(route: R, params?: RoutingParams[R], navigator?: any) => {
    emitEvent('navigate', route);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (navigator?.push ?? (navigation as any).push ?? navigation.navigate)(route, params as RoutingParams[R]);
  }, [emitEvent, navigation]);

  const search = React.useCallback((params: RoutingParams['search'], navigator?: any) => {
    const prefilter = params.prefilter;
    if (!prefilter) {
      return;
    }
    setPreference('searchHistory', (prev) => Array.from(new Set([prefilter, ...(prev ?? [])])).slice(0, 10));
    navigate('search', params, navigator);
  }, [navigate, setPreference]);
  
  const openSummary = React.useCallback((props: RoutingParams['summary'], navigator?: any) => {
    navigate('summary', {
      ...props,
      initialFormat: props.initialFormat ?? preferredReadingFormat ?? ReadingFormat.Bullets,
    }, navigator);
  }, [navigate, preferredReadingFormat]);

  const openPublisher = React.useCallback((publisher: PublicPublisherAttributes) => {
    navigate('publisher', { publisher });
  }, [navigate]);

  const openCategory = React.useCallback((category: PublicCategoryAttributes) => {
    navigate('category', { category });
  }, [navigate]);

  const router = React.useCallback(({ url, navigator }: { url: string, navigator?: any }) => {
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
    if (route === 'read') {
      const summary = Number.parseInt(params['s'] ?? '0');
      if (!summary) {
        return;
      }
      const initialFormat = readingFormat(params['f']);
      openSummary({ initialFormat, summary }, navigator);
    } else
    if (route === 'search') {
      const filter = params['filter']?.trim();
      if (!filter) {
        return;
      }
      search({ prefilter: filter }, navigator);
    } else
    if (route === 'publisher') {
      const publisher = params['publisher']?.trim();
      if (!publisher) {
        return;
      }
      openPublisher({ name: publisher });
    } else
    if (route === 'category') {
      const category = params['category']?.trim();
      if (!category) {
        return;
      }
      openCategory({ name: category });
    } 
  }, [navigation, search, openSummary, openPublisher, openCategory]);
  
  return {
    navigate,
    navigation,
    openCategory,
    openPublisher,
    openSummary,
    router,
    search,
  };

}