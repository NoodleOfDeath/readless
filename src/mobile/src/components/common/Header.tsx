import React from 'react';

import {
  Badge,
  Chip,
  ContextMenu,
  ContextMenuAction,
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

export function DrawerToggle() {
  const { navigation } = useNavigation();
  const { unreadBookmarkCount } = React.useContext(SessionContext);
  return (
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
  
  const notificationMenu: ContextMenuAction[] = React.useMemo(() => [
    {
      onPress: () => console.log('test'),
      systemIcon: 'bell',
      title: 'Push Notifications',
    },
    {
      onPress: () => console.log('test'),
      title: 'Email Notifications',
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
      {menu && <DrawerToggle />}
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
          <ContextMenu 
            actions={ notificationMenu }>
            <Chip
              leftIcon="bell"
              iconSize={ 24 } />
          </ContextMenu>
        )}
      </View>
    </View>
  );
}