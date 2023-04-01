import { LinkingOptions } from '@react-navigation/native';

import { ReadingFormat, SummaryResponse } from '../api';

export type RootParamList = {
  Discover: {
    Home: undefined;
    Summary: {
      summary?: SummaryResponse;
      format?: ReadingFormat;
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
  prefixes: ['https://www.readless.ai', 'https://readless.ai', 'rlctl://'],
};
