import React from 'react';

import {
  Button,
  Text,
  View,
  ViewProps,
} from '~/components';
import { useStyles } from '~/hooks';

export type CollapsedViewProps = ViewProps & {
  title?: React.ReactNode;
  startCollapsed?: boolean;
  onExpand?: () => void;
  onCollapse?: () => void;
};

export function CollapsedView({
  title,
  startCollapsed,
  onExpand,
  onCollapse,
  children,
  ...props
}: CollapsedViewProps) {

  const style = useStyles(props);

  const [collapsed, setCollapsed] = React.useState(startCollapsed);

  React.useEffect(() => {
    collapsed ? onCollapse?.() : onExpand?.();
  }, [collapsed, onCollapse, onExpand]);

  return (
    <View style={ style }>
      <View row mv={ 8 } gap={ 6 } alignCenter>
        <Button
          elevated
          p={ 6 }
          rounded
          iconSize={ 24 }
          onPress={ () => setCollapsed((prev) => !prev) }
          startIcon={ collapsed ? 'chevron-right' : 'chevron-down' } />
        {typeof title === 'string' ? <Text subtitle1>{title}</Text> : title}
      </View>
      {!collapsed && (
        <View>
          {children}
        </View>
      )}
    </View>
  );

}