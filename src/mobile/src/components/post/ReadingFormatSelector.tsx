import React from 'react';
import { Pressable, Text } from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { ReadingFormat } from '../../api';
import FlexView from '../common/FlexView';
import { useTheme } from '../theme';

type Props = {
  format?: ReadingFormat;
  onChange?: (mode?: ReadingFormat) => void;
};

const FORMAT_ICONS = {
  [ReadingFormat.Concise]: 'text-short',
  [ReadingFormat.Bullets]: 'format-list-bulleted',
  [ReadingFormat.Casual]: 'text-long',
  [ReadingFormat.Detailed]: 'text-box',
  [ReadingFormat.InDepth]: 'text-box-multiple',
} as const;

export default function ReadingFormatSelector({
  format,
  onChange,
}: Props = {}) {
  const theme = useTheme();

  const selectedIndex = React.useMemo(() => {
    return Object.keys(FORMAT_ICONS).indexOf(format);
  }, [format]);

  const Icon = React.useCallback((newFormat: ReadingFormat, row = 0) => {
    const textStyle = {
      ...theme.components.button,
      ...(format === newFormat ? theme.components.buttonSelected : {}),
    };
    return (
      <Pressable width={ row === 0 ? '33.33%' : '50%' } style={ { ...theme.components.buttonPadded, ...(format === newFormat ? theme.components.buttonSelected : {}) } } onPress={ () => onChange?.(newFormat) }>
        <FlexView row>
          <MaterialCommunityIcons
            name={ FORMAT_ICONS[newFormat] }
            size={ 24 }
            style={ textStyle } />
          <Text style={ { ...textStyle, ...theme.components.buttonText } }>{newFormat}</Text>
        </FlexView>
      </Pressable>
    );
  }, [format, onChange]);

  return (
    <FlexView style={ theme.components.buttonGroup }>
      <FlexView row style={ theme.components.buttonGroupRow }>
        {Icon(ReadingFormat.Concise)}
        {Icon(ReadingFormat.Bullets)}
        {Icon(ReadingFormat.Casual)}
      </FlexView>
      <FlexView row style={ theme.components.buttonGroupRow }>
        {Icon(ReadingFormat.Detailed, 1)}
        {Icon(ReadingFormat.InDepth, 1)}
      </FlexView>
    </FlexView>
  );
}
