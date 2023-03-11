import { ScaledSize } from "react-native";
import { Dimensions } from "react-native";
import { Platform } from "react-native";

export const isIos = Platform.OS === "ios";
export const isAndroid = Platform.OS === "android";

export const window = Dimensions.get("window");