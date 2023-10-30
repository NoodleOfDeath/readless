import React from 'react';

import { SheetManager } from 'react-native-actions-sheet';

import {
  CardStack,
  CardStackEntryProps,
  CardStackProps,
} from '~/components';
import { StorageContext } from '~/core';
import { strings } from '~/locales';

export const FEATURES: CardStackEntryProps[] = [
  {
    id: 'appearance-walkthrough',
    image: 'https://readless.nyc3.cdn.digitaloceanspaces.com/img/guides/walkthrough-customize-appearance.png',
    onPress: async () => {
      await SheetManager.show('appearance-walkthrough');
    },
    title: strings.walkthroughs_appearance_stackTitle,
  },
  {
    id: 'custom-feed-walkthrough',
    image: 'https://readless.nyc3.cdn.digitaloceanspaces.com/img/guides/walkthrough-customize-feed.PNG',
    onPress: async () => {
      await SheetManager.show('custom-feed-walkthrough');
    },
    title:  strings.walkthroughs_customFeed_stackTitle,
  },
  {
    id: 'sentiment-walkthrough', 
    image: 'https://readless.nyc3.cdn.digitaloceanspaces.com/img/guides/walkthrough-sentiment.png',
    onPress: async () => {
      await SheetManager.show('sentiment-walkthrough');
    },
    title: strings.walkthroughs_sentiment_whatIsSentimentAnalysis,
  },
  {
    id: 'trigger-words-walkthrough',
    image: 'https://readless.nyc3.cdn.digitaloceanspaces.com/img/guides/walkthrough-trigger-words.png',
    onPress: async () => {
      await SheetManager.show('trigger-words-walkthrough');
    },
    title: strings.walkthroughs_triggerWords,
  },
];

type Props = CardStackProps & {
  onClose?: () => void;
};

export function WalkthroughStack({ onClose, ...props }: Props = {}) {
  
  const { viewedFeatures } = React.useContext(StorageContext);
  const cards = React.useMemo(() => FEATURES.filter((feature) => !(feature.id in (viewedFeatures ?? {}))), [viewedFeatures]);
  
  return cards.length > 0 && (
    <CardStack
      { ...props }
      onClose={ onClose }
      onPressItem={ (index) => cards[index].onPress?.() }
      cards={ cards } />
  );
}