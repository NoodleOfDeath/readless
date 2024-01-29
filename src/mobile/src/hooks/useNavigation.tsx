import React from 'react';

import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation as useRNNavigation } from '@react-navigation/native';
import { StackActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useInAppBrowser } from './useInAppBrowser';

import { 
  InteractionType,
  PublicCategoryAttributes, 
  PublicPublisherAttributes,
  ReadingFormat,
} from '~/api';
import { StorageContext } from '~/contexts';
import {
  HOME_STACK_KEYS,
  LOGIN_STACK_KEYS,
  SETTINGS_STACK_KEYS,
} from '~/navigation';
import { NavigationID, RoutingParams } from '~/screens';
import { readingFormat, usePlatformTools } from '~/utils';

export type DrawerNavigation = DrawerNavigationProp<RoutingParams, keyof RoutingParams, NavigationID>;
export type StackNavigator = NativeStackNavigationProp<RoutingParams, keyof RoutingParams, NavigationID>;
export type Navigation = DrawerNavigation & StackNavigator;

export function useNavigation() {

  const { emitStorageEvent } = usePlatformTools();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navigation = useRNNavigation<Navigation>();
  const { openURL } = useInAppBrowser();
  
  const { 
    api: { interactWithSummary },
    preferredReadingFormat, 
    setStoredValue,
  } = React.useContext(StorageContext);

  const navigate = React.useCallback(<R extends keyof RoutingParams>(route: R, params?: RoutingParams[R]) => {
    emitStorageEvent('navigate', route);
    if (LOGIN_STACK_KEYS.includes(route)) {
      if (!navigation.getState().routes.some(({ name }) => name === 'login')) {
        navigation.navigate('login');
      }
      return navigation.dispatch(StackActions.push(route, params));
    } else
    if (HOME_STACK_KEYS.includes(route)) {
      if (!navigation.getState().routes.some(({ name }) => name === 'home')) {
        navigation.navigate('home');
      }
      return navigation.dispatch(StackActions.push(route, params));
    } else
    if (SETTINGS_STACK_KEYS.includes(route)) {
      if (!navigation.getState().routes.some(({ name }) => name === 'settings')) {
        navigation.navigate('settings');
      }
      return navigation.dispatch(StackActions.push(route, params));
    }
  }, [emitStorageEvent, navigation]);
  
  const beginSearch = React.useCallback((params: RoutingParams['search']) => {
    navigate('search', params);
  }, [navigate]);

  const search = React.useCallback((params: RoutingParams['summaryList']) => {
    const prefilter = params.prefilter;
    if (!prefilter) {
      return;
    }
    setStoredValue('searchHistory', (prev) => Array.from(new Set([prefilter, ...(prev ?? [])])).slice(0, 100));
    navigate('summaryList', params);
  }, [navigate, setStoredValue]);
  
  const openSummary = React.useCallback((props: RoutingParams['summary']) => {
    interactWithSummary(typeof props.summary === 'number' ? props.summary : props.summary.id, InteractionType.Read, { metadata: { format: props.initialFormat ?? preferredReadingFormat ?? ReadingFormat.Bullets } });
    navigate('summary', {
      ...props,
      initialFormat: props.initialFormat ?? preferredReadingFormat ?? ReadingFormat.Bullets,
    });
  }, [navigate, preferredReadingFormat, interactWithSummary]);

  const openPublisher = React.useCallback((publisher: PublicPublisherAttributes) => {
    navigate('publisher', { publisher });
  }, [navigate]);

  const openCategory = React.useCallback((category: PublicCategoryAttributes) => {
    navigate('category', { category });
  }, [navigate]);

  const router = React.useCallback(({ url }: { url: string }) => {
    // http://localhost:6969/read/?s=158&f=casual
    // https://dev.readless.ai/read/?s=158&f=casual
    // https://www.readless.ai/read/?s=4070&f=bullets
    // readless://read/?s=4070
    // readless://verify/?otp=e29h715gti
    const [path, query] = url.split('?');
    const expr = /^(?:readless|https?):\/\/(?:(?:(?:(?:dev|www)\.)?readless\.ai)|localhost(?::\d+)?)?\/?(\w+)\/?/;
    const [, route] = path.match(expr) ?? [];
    const params: Record<string, string> = {};
    if (query) {
      query.split('&').forEach((pair) => {
        const [key, value] = pair.split('=');
        params[decodeURIComponent(key)] = decodeURIComponent(value || '');
      });
    }
    if (route === 'verify') {
      navigate('verifyOtp', { code: params['code'], otp: params['otp'] });
    } else
    if (route === 'delete') {
      openURL(url); 
    } else
    if (route === 'read') {
      const summary = Number.parseInt(params['s'] ?? '0');
      if (!summary) {
        return;
      }
      const initialFormat = readingFormat(params['f']);
      openSummary({ initialFormat, summary });
    } else
    if (route === 'top') {
      navigate('topStories');
    } else
    if (route === 'live') {
      navigate('liveFeed');
    } else
    if (route === 'search') {
      const filter = params['filter']?.trim();
      if (!filter) {
        return;
      }
      search({ prefilter: filter });
    } else
    if (route === 'publisher') {
      const publisher = params['publisher']?.trim();
      if (!publisher) {
        return;
      }
      openPublisher({ displayName: '', name: publisher });
    } else
    if (route === 'category') {
      const category = params['category']?.trim();
      if (!category) {
        return;
      }
      openCategory({
        displayName: '', icon: '', name: category, 
      });
    }
  }, [navigate, openURL, openSummary, search, openPublisher, openCategory]);
  
  return {
    beginSearch,
    navigate,
    navigation,
    openCategory,
    openPublisher,
    openSummary,
    router,
    search,
  };

}