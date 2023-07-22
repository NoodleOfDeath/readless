import React from 'react';

import { HoldItem } from 'react-native-hold-menu';
import { MenuItemProps } from 'react-native-hold-menu/lib/typescript/components/menu/types';

import {
  Badge,
  Chip,
  Icon,
  ScrollView,
  SearchMenu,
  Text,
  View,
  ViewProps,
} from '~/components';
import { SessionContext } from '~/core';
import { useNavigation, useTheme } from '~/hooks';

export type BackNavigationProps = {
  title?: string;
  size?: number;
};

export function BackNavigation({
  title,
  size = 36,
}: BackNavigationProps = {}) {
  const { navigation } = useNavigation();
  return (
    <Chip 
      leftIcon="menu-left" 
      iconSize={ size } 
      itemsCenter
      gap={ 3 }
      ml={ -10 }
      onPress={ () => navigation?.goBack() }>
      {title}
    </Chip>
  );
}

export type HeaderProps = ViewProps & {
  children?: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  back?: boolean;
  backTitle?: string;
  menu?: boolean;
  search?: boolean;
  searchValue?: string;
  notifications?: boolean;
  elevated?: boolean;
  scrollable?: boolean;
  big?: boolean;
};

export function Header({
  children,
  title,
  subtitle,
  back,
  backTitle,
  menu,
  search,
  searchValue,
  notifications,
  scrollable,
  big,
  height = big ? 140 : 80,
  ...props
}: HeaderProps) {
  
  const theme = useTheme();
  const { navigation } = useNavigation();
  const { unreadBookmarkCount } = React.useContext(SessionContext);
  
  const content = React.useMemo(() => (
    (title || children) && (
      <View gap={ 6 }>
        {title && (
          <View flexGrow={ 1 }>
            <Text bold adjustsFontSizeToFit numberOfLines={ 2 }>
              {title}
            </Text>
            {subtitle && (
              <Text
                color={ theme.colors.textSecondary }
                adjustsFontSizeToFit>
                {subtitle}
              </Text>
            )}
          </View>
        )}
        {children}
      </View>
    )
  ), [title, subtitle, children, theme.colors.textSecondary]);
  
  const notificationMenu: MenuItemProps[] = React.useMemo(() => [
    {
      icon: () => <Icon name="bell" />,
      key: 'push',
      onPress: () => console.log('test'),
      text: 'Push Notifications',
    },
    {
      icon: () => <Icon name="mail" />,
      key: 'mail',
      onPress: () => console.log('test'),
      text: 'Email Notifications',
    },
  ], []);
  
  return (
    <View 
      flexRow
      itemsCenter
      height={ height }
      px={ 12 }
      bg={ theme.components.card.backgroundColor }
      { ...props }>
      {back && (
        <BackNavigation title={ backTitle } />
      )}
      {menu && (
        <View>
          {unreadBookmarkCount > 0 && (
            <Badge topLeft small>
              {unreadBookmarkCount}
            </Badge>
          )}
          <Chip
            haptic
            leftIcon='menu' 
            iconSize={ 24 }
            onPress={ () => navigation?.toggleDrawer?.() } />
        </View>
      )}
      {search && (
        <SearchMenu 
          flex={ 1 }
          flexGrow={ 1 }
          initialValue={ searchValue } />
      )}
      {content && (
        scrollable ? (
          <ScrollView flex={ 1 } flexGrow={ 1 } horizontal overflow='visible'>
            {content}
          </ScrollView>
        ) : (
          <View flex={ 1 } flexGrow={ 1 }>
            {content}
          </View>
        )
      )}
      <View minWidth={ 24 }>
        {notifications && (
          <HoldItem 
            activateOn="tap" 
            items={ notificationMenu }>
            <Chip
              leftIcon="bell"
              iconSize={ 24 } />
          </HoldItem>
        )}
      </View>
    </View>
  );
}