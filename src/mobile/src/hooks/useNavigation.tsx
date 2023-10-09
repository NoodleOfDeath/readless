import React from 'react';

import { useNavigation as useRNNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { 
  PublicCategoryAttributes, 
  PublicPublisherAttributes,
  ReadingFormat,
} from '~/api';
import { SessionContext } from '~/contexts';
import { NavigationID, RoutingParams } from '~/screens';
import { readingFormat, usePlatformTools } from '~/utils';

export type Navigation = NativeStackNavigationProp<RoutingParams, keyof RoutingParams, NavigationID>;

export function useNavigation() {

  const { emitEvent } = usePlatformTools();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navigation = useRNNavigation<Navigation>();
  
  const { preferredReadingFormat, setPreference } = React.useContext(SessionContext);

  const navigate = React.useCallback(<R extends keyof RoutingParams>(route: R, params?: RoutingParams[R], stackNav?: Navigation) => {
    emitEvent('navigate', route);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (stackNav?.push ?? (navigation as any).push ?? navigation.navigate)(route, params as RoutingParams[R]);
  }, [emitEvent, navigation]);

  const search = React.useCallback((params: RoutingParams['search'], stackNav?: Navigation) => {
    const prefilter = params.prefilter;
    if (!prefilter) {
      return;
    }
    setPreference('searchHistory', (prev) => Array.from(new Set([prefilter, ...(prev ?? [])])).slice(0, 10));
    navigate('search', params, stackNav);
  }, [navigate, setPreference]);
  
  const openSummary = React.useCallback((props: RoutingParams['summary'], stackNav?: Navigation) => {
    navigate('summary', {
      ...props,
      initialFormat: props.initialFormat ?? preferredReadingFormat ?? ReadingFormat.Bullets,
    }, stackNav);
  }, [navigate, preferredReadingFormat]);

  const openPublisher = React.useCallback((publisher: PublicPublisherAttributes, stackNav?: Navigation) => {
    navigate('publisher', { publisher }, stackNav);
  }, [navigate]);

  const openCategory = React.useCallback((category: PublicCategoryAttributes, stackNav?: Navigation) => {
    navigate('category', { category }, stackNav);
  }, [navigate]);

  const router = React.useCallback(({ url, stackNav }: { url: string, stackNav?: Navigation }) => {
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
      openSummary({ initialFormat, summary }, stackNav);
    } else
    if (route === 'top') {
      navigate('topStories');
    } else
    if (route === 'search') {
      const filter = params['filter']?.trim();
      if (!filter) {
        return;
      }
      search({ prefilter: filter }, stackNav);
    } else
    if (route === 'publisher') {
      const publisher = params['publisher']?.trim();
      if (!publisher) {
        return;
      }
      openPublisher({ displayName: '', name: publisher }, stackNav);
    } else
    if (route === 'category') {
      const category = params['category']?.trim();
      if (!category) {
        return;
      }
      openCategory({
        displayName: '', icon: '', name: category, 
      }, stackNav);
    } 
  }, [navigate, search, openSummary, openPublisher, openCategory]);
  
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