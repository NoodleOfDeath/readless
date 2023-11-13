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

export type TableViewCellProps = TextProps & ChildlessViewProps & {
  accessory?: false | 'DisclosureIndicator' | 'Detail' | 'DetailDisclosure' | 'Checkmark';
  accessoryColor?: ViewStyle['borderColor'] | TextStyle['color'];
  accessoryColorDisclosureIndicator?: ViewStyle['borderColor'];
  allowFontScaling?: boolean;
  backgroundColor?: ViewStyle['backgroundColor'];
  cellStyle?: 'Basic' | 'RightDetail' | 'LeftDetail' | 'Subtitle';
  cellAccessoryView?: React.ReactNode;
  cellContentView?: React.ReactNode;
  cellImageView?: React.ReactNode;
  cellIcon?: React.ReactNode;
  children?: React.ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
  detail?: string | number;
  detailTextStyle?: StyleProp<TextStyle>;
  detailTextProps?: TextProps;
  disableImageResize?: boolean;
  hideSeparator?: boolean;
  highlightActiveOpacity?: number;
  highlightUnderlayColor?: ViewStyle['backgroundColor'];
  image?: React.ReactElement;
  isDisabled?: boolean;
  onPress?: () => void | false;
  onLongPress?: () => void | false;
  onPressDetailAccessory?: () => void | false;
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

export function TableViewCell(props: TableViewCellProps) {
  const theme= useTheme();
  const style = useStyles(props);
  const textStyles = useTextStyles({ ...props, system: true });
  const stylesWithoutFontScaling = { padding: 3, ...textStyles };
  return (
    <Cell
      { ...props }
      allowFontScaling
      { ...theme.components.tableViewCell }
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