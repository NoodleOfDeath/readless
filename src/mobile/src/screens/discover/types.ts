import { SourceWithOutletAttr } from "../../api/Api";
import { ConsumptionMode } from "../../components/post/ConsumptionModeSelector";

export type RootStackParamList = {
  Home: undefined;
  Post: {
    source?: SourceWithOutletAttr;
    initialMode?: ConsumptionMode;
  };
};
