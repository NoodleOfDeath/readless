import React from 'react';
import {
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';

import { Cell } from 'react-native-tableview-simple';

import {
  ChildlessViewProps,
  Icon,
  TextProps,
  View,
} from '~/components';
import {
  useStyles,
  useTextStyles,
  useTheme,
} from '~/hooks';

type TableViewCellImageProps = ChildlessViewProps & {
  icon?: React.ReactNode;
  size?: number;
};

export function TableViewCellImage({
  icon,
  size = 24,
  ...props
}: TableViewCellImageProps) {
  const style = useStyles(props);
  return icon && (
    <View
      mr={ 12 }
      style={ style }>
      {typeof icon === 'string' ? (
        <Icon
          name={ icon }
          size={ size } />
      ) : icon}
    </View>
  );
}

export type TableViewCellProps = ChildlessViewProps & TextProps & {
  accessory?: 'Checkmark' | 'Detail' | 'DetailDisclosure' | 'DisclosureIndicator' | false;
  accessoryColor?: TextStyle['color'] | ViewStyle['borderColor'];
  accessoryColorDisclosureIndicator?: ViewStyle['borderColor'];
  allowFontScaling?: boolean;
  backgroundColor?: ViewStyle['backgroundColor'];
  cellStyle?: 'Basic' | 'LeftDetail' | 'RightDetail' | 'Subtitle';
  leftDetail?: boolean;
  rightDetail?: boolean;
  subtitle?: boolean;
  cellAccessoryView?: React.ReactNode;
  cellContentView?: React.ReactNode;
  cellImageView?: React.ReactNode;
  cellIcon?: React.ReactNode;
  children?: React.ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
  detail?: number | string;
  detailTextStyle?: StyleProp<TextStyle>;
  detailTextProps?: TextProps;
  disableImageResize?: boolean;
  hideSeparator?: boolean;
  highlightActiveOpacity?: number;
  highlightUnderlayColor?: ViewStyle['backgroundColor'];
  image?: React.ReactElement;
  isDisabled?: boolean;
  onPress?: () => false | void;
  onLongPress?: () => false | void;
  onPressDetailAccessory?: () => false | void;
  onUnHighlightRow?(): void;
  onHighlightRow?(): void;
  leftDetailColor?: TextStyle['color'];
  rightDetailColor?: TextStyle['color'];
  subtitleColor?: TextStyle['color'];
  subtitleTextStyle?: StyleProp<TextStyle>;
  testID?: string;
  title?: React.ReactNode;
  titleTextProps?: TextProps;
  titleTextStyle?: StyleProp<TextStyle>;
  titleTextStyleDisabled?: StyleProp<TextStyle>;
  titleTextColor?: TextStyle['color'];
  withSafeAreaView?: boolean;
};

export function TableViewCell({
  detail,
  leftDetail,
  subtitle,
  rightDetail = !subtitle && !leftDetail && Boolean(detail),
  cellStyle = leftDetail ? 'LeftDetail' : rightDetail ? 'RightDetail' : subtitle ? 'Subtitle' : 'Basic',
  ...rest
}: TableViewCellProps) {
  const props = {
    cellStyle,
    detail, 
    ...rest, 
  };
  const theme= useTheme();
  const style = useStyles(props);
  const textStyles = useTextStyles({ ...props, system: true });
  const stylesWithoutFontScaling = { padding: 3, ...textStyles };
  return (
    <Cell
      { ...theme.components.tableViewCell }
      { ...props }
      allowFontScaling
      contentContainerStyle={ [stylesWithoutFontScaling] }
      titleTextStyle={ [stylesWithoutFontScaling, props.titleTextStyle, { flex: 1 }] }
      detailTextStyle={ [stylesWithoutFontScaling, props.detailTextStyle, { color: theme.colors.textSecondary }] }
      subtitleTextStyle={ [stylesWithoutFontScaling, props.subtitleTextStyle, { color: theme.colors.textSecondary }] }
      accessoryColor={ props.accessoryColor || theme.colors.textSecondary }
      accessoryColorDisclosureIndicator={ props.accessoryColorDisclosureIndicator || theme.colors.textSecondary }
      highlightUnderlayColor={ props.highlightUnderlayColor || style.backgroundColor }
      highlightActiveOpacity={ props.highlightActiveOpacity || 0.8 }
      titleTextStyleDisabled={ props.titleTextStyleDisabled || style.color } 
      cellImageView={ props.cellImageView ?? props.image ?? <TableViewCellImage icon={ props.cellIcon } /> } />
  );
}   