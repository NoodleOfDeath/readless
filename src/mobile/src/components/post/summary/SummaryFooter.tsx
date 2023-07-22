import React from 'react';

import pluralize from 'pluralize';
import { HoldItem } from 'react-native-hold-menu';

import { ComputedSummaryProps } from '~/components';
import {
  Chip,
  PublisherChip,
  Text,
  View,
} from '~/components';
import { useNavigation, useTheme } from '~/hooks';
import { strings } from '~/locales';

export type SummaryFooterProps = ComputedSummaryProps & {
  showShare?: boolean;
  onShare?: () => void;
};

export function SummaryFooter({
  notCompact,
  category,
  publisher,
  disableInteractions,
  disableNavigation,
  hideArticleCount,
  isBookmarked,
  siblingCount = 0,
  menuItems = [],
  showShare,
  onShare,
  ...props
}: SummaryFooterProps) {

  const theme = useTheme();
  const { navigate, openCategory } = useNavigation();

  return (
    <View
      { ...props }
      flexRow
      gap={ 6 }
      itemsCenter>
      {(!notCompact || showShare) && (
        <React.Fragment>
          <PublisherChip
            disabled={ disableNavigation }
            publisher={ publisher } />
          <Text
            caption
            color={ theme.colors.textSecondary }>
            •
          </Text>
        </React.Fragment>
      )}
      <Chip
        caption
        color={ theme.colors.textSecondary }
        itemsCenter
        haptic
        leftIcon={ category?.icon }
        gap={ 3 }
        onPress={ () => !disableNavigation && category && openCategory(category) }>
        {category?.displayName}
      </Chip>
      {!hideArticleCount && (
        <React.Fragment>
          <Text
            caption
            color={ theme.colors.textSecondary }>
            •
          </Text>
          <Chip
            caption
            color={ theme.colors.textSecondary }>
            {`${siblingCount + 1} ${pluralize(strings.misc_article, siblingCount + 1)}`}
          </Chip>
        </React.Fragment>
      )}
      {isBookmarked && (
        <React.Fragment>
          <Text
            caption
            color={ theme.colors.textSecondary }>
            •
          </Text>
          <Chip
            caption
            color={ theme.colors.textSecondary }
            leftIcon="bookmark"
            onPress={ () => !disableNavigation && navigate('bookmarks') }>
            {strings.summary_bookmarked}
          </Chip>
        </React.Fragment>
      )}
      {showShare && (
        <React.Fragment>
          <View row />
          <View flexRow itemsCenter gap={ 6 }>
            <Chip
              caption
              color={ theme.colors.textSecondary }
              leftIcon="share"
              haptic
              gap={ 3 }
              onPress={ async () => {
                if (disableInteractions) {
                  return;
                }
                onShare?.();
              } }>
              {strings.action_share}
            </Chip>
            <HoldItem
              activateOn='tap'
              items={ menuItems }
              closeOnTap>
              <Chip
                caption
                gap={ 3 }
                color={ theme.colors.textSecondary }
                leftIcon="menu-down">
                {strings.misc_more}
              </Chip>
            </HoldItem>
          </View>
        </React.Fragment>
      )}
    </View>
  );
}