import React from 'react';

import { Slider } from 'native-base';

import { FONT_SIZES, Stepper } from '~/components';
import { SessionContext } from '~/contexts';

export type FontSizePickerProps = {
  variant?: 'slider' | 'stepper';
  slider?: boolean;
};

const MIN_FONT_OFFSET = -5;
const MAX_FONT_OFFSET = 5;
const FONT_SIZE_STEP = 0.5;

export function FontSizePicker({
  slider,
  variant = slider ? 'slider' : 'stepper',
}: FontSizePickerProps = {}) {
  
  const { fontSizeOffset = 0, setPreference } = React.useContext(SessionContext);  
  
  const [value, setValue] = React.useState(fontSizeOffset);

  const onValueChange = React.useCallback((values: number | number[]) => {
    let newValue = typeof values === 'number' ? values : values[0];
    if (newValue < MIN_FONT_OFFSET) {
      newValue = MIN_FONT_OFFSET;
    } else if (newValue > MAX_FONT_OFFSET) {
      newValue = MAX_FONT_OFFSET;
    }
    setValue(newValue);
    setPreference('fontSizeOffset', newValue);
  }, [setPreference]);

  return variant === 'stepper' ? (
    <Stepper
      value={ value }
      offset={ FONT_SIZES.body1 }
      minimumValue={ MIN_FONT_OFFSET }
      maximumValue={ MAX_FONT_OFFSET }
      stepValue={ FONT_SIZE_STEP }
      onValueChange={ onValueChange } />
  ) : (
    <Slider
      value={ value }
      minValue={ MIN_FONT_OFFSET }
      maxValue={ MAX_FONT_OFFSET }
      onChange={ onValueChange } />
  );
}