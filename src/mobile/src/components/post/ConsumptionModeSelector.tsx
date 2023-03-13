import React from "react";
import { ButtonGroup } from "react-native-elements";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useTheme } from "../theme";

export const CONSUMPTION_MODES = {
  keyPoints: "format-list-bulleted",
  concise: "view-headline",
  casual: "view-list",
  comprehensive: "view-stream",
  comparative: "view-column",
} as const;

export type ConsumptionMode = keyof typeof CONSUMPTION_MODES;
export const CONSUMPTION_MODE_NAMES = Object.keys(
  CONSUMPTION_MODES
) as ConsumptionMode[];

type Props = {
  mode?: ConsumptionMode;
  onChange?: (mode?: ConsumptionMode) => void;
};

export default function ConsumptionModeSelector({
  mode,
  onChange,
}: Props = {}) {
  const theme = useTheme();

  const selectedIndex = React.useMemo(() => {
    if (!mode) return undefined;
    return CONSUMPTION_MODE_NAMES.indexOf(mode);
  }, [mode]);

  const handlePress = React.useCallback(
    (index: number) => {
      if (index === CONSUMPTION_MODE_NAMES.length - 1) return;
      onChange?.(CONSUMPTION_MODE_NAMES[index]);
    },
    [onChange]
  );

  return (
    <ButtonGroup
      onPress={handlePress}
      selectedIndex={selectedIndex}
      buttons={Object.values(CONSUMPTION_MODES).map((icon, i) => (
        <MaterialCommunityIcons
          key={i}
          disabled={i === CONSUMPTION_MODE_NAMES.length - 1}
          name={icon}
          size={24}
          style={
            i === CONSUMPTION_MODE_NAMES.length - 1
              ? theme.components.buttonDisabled
              : theme.components.button
          }
        />
      ))}
      containerStyle={theme.components.buttonGroup}
    />
  );
}
