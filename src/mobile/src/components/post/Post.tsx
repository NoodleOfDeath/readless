import { Divider } from "react-native-elements";
import React from "react";
import { formatDistance } from "date-fns";
import { Linking, Pressable, Text } from "react-native";

import { SourceWithOutletAttr } from "../../api/Api";
import FlexView from "../common/FlexView";
import Menu from "../common/Menu";
import { useTheme } from "../theme";
import ConsumptionModeSelector, {
  ConsumptionMode,
} from "./ConsumptionModeSelector";

type Props = {
  source: SourceWithOutletAttr;
  tickIntervalMs?: number;
  mode?: ConsumptionMode;
  onChange?: (mode?: ConsumptionMode) => void;
};

export default function Post({
  source,
  tickIntervalMs = 60_000,
  mode,
  onChange,
}: Props) {
  const theme = useTheme();

  const [lastTick, setLastTick] = React.useState(new Date());

  const timeAgo = React.useMemo(() => {
    return formatDistance(new Date(source.createdAt), lastTick, {
      addSuffix: true,
    });
  }, [source.createdAt, lastTick]);

  const options = React.useMemo(() => {
    return [
      {
        label: "View original source",
        onPress: async () => {
          await Linking.openURL(source.url);
        },
      },
    ];
  }, [source.url]);

  // pdate time ago every `tickIntervalMs` milliseconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      setLastTick(new Date());
    }, tickIntervalMs);
    return () => clearInterval(interval);
  }, [tickIntervalMs]);

  const content = React.useMemo(() => {
    if (!mode || !source) return null;
    switch (mode) {
      case "keyPoints":
        return source.bullets.join("\n");
      case "concise":
        return source.shortSummary;
      case "casual":
        return source.summary;
      case "comprehensive":
        return source.abridged;
      default:
        return null;
    }
  }, [mode, source]);

  return (
    <FlexView style={theme.components.card}>
      <Text style={theme.typography.subtitle1}>{source.outletName.trim()}</Text>
      <Pressable onPress={() => onChange?.("casual")}>
        <Text style={theme.typography.title1}>{source.title.trim()}</Text>
      </Pressable>
      <Divider orientation="horizontal" style={theme.components.divider} />
      <FlexView row>
        <Text style={theme.typography.subtitle2}>{timeAgo}</Text>
        <Menu icon="dots-horizontal" options={options} />
      </FlexView>
      <FlexView mt={2}>
        <ConsumptionModeSelector mode={mode} onChange={onChange} />
        <FlexView mt={4}>
          {content && <Text style={theme.typography.body1}>{content}</Text>}
        </FlexView>
      </FlexView>
    </FlexView>
  );
}
