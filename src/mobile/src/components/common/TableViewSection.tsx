import React from 'react';
import { TextStyle, ViewStyle } from 'react-native';

// eslint-disable-next-line import-newlines/enforce
import { Section } from 'react-native-tableview-simple';

import { View, ViewProps } from '~/components';
import { useStyles, useTheme } from '~/hooks';

export type TableViewSectionProps = ViewProps & {
    grouped?: boolean;
} & {
  allowFontScaling?: boolean;
  children?: React.ReactNode;
  footerComponent?: React.ReactNode;
  headerComponent?: React.ReactNode;
  footer?: string;
  footerTextColor?: TextStyle['color'];
  footerTextStyle?: TextStyle;
  header?: string;
  headerTextColor?: TextStyle['color'];
  headerTextStyle?: TextStyle;
  hideSeparator?: boolean;
  hideSurroundingSeparators?: boolean;
  roundedCorners?: boolean;
  sectionPaddingBottom?: ViewStyle['paddingBottom'];
  sectionPaddingTop?: ViewStyle['paddingTop'];
  sectionTintColor?: ViewStyle['backgroundColor'];
  separatorInsetLeft?: ViewStyle['marginLeft'];
  separatorInsetRight?: ViewStyle['marginRight'];
  separatorTintColor?: ViewStyle['backgroundColor'];
  withSafeAreaView?: boolean;
};

export function TableViewSection({
  children, 
  grouped,
  ...props 
}: TableViewSectionProps) {

  const theme = useTheme();
  const style = useStyles(props);

  return (
    <View mx={ grouped ? 24 : 0 }>
      <Section
        { ...props }
        hideSeparator={ grouped }
        roundedCorners={ grouped }>
        <View style={ style }>
          {children}
        </View>
      </Section>
    </View>
  );
}   