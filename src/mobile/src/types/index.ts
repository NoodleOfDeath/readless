import { LinkingOptions } from '@react-navigation/native';

import { SourceWithOutletAttr } from '../api/Api';
import { ConsumptionMode } from '../components/post/ConsumptionModeSelector';

export type RootParamList = {
  Discover: {
    Home: undefined;
    Post: {
      source?: SourceWithOutletAttr;
      initialMode?: ConsumptionMode;
    };
  };
  Settings: undefined;
};

export const linkingOptions: LinkingOptions<RootParamList> = {
  config: {
    screens: {
      Discover: { path: 'discover' },
      Settings: { path: 'settings' },
    },
  },
  prefixes: ['https://www.theskoop.ai', 'https://theskoop.ai', 'skoop://'],
};
