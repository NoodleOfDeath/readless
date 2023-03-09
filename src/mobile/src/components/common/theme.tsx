import { StyleSheet, useColorScheme } from "react-native";

// eslint-disable-next-line @typescript-eslint/ban-types
export function useTheme<T extends {}>(other: T = {} as T) {
  const isLightMode = useColorScheme() === "light";
  return {
    isLightMode,
    ...StyleSheet.create({
      components: {
        // containers
        button: {
          alignItems: "center",
          color: "#8B0000",
          fontFamily: "Lato",
          justifyContent: "center",
        },
        buttonBlock: {
          alignItems: "center",
          backgroundColor: isLightMode ? "#fff" : "#000",
          color: "#8B0000",
          fontFamily: "Lato",
          justifyContent: "center",
          padding: 10,
        },
        buttonDisabled: {
          alignItems: "center",
          color: isLightMode ? "#ccc" : "#333",
          fontFamily: "Lato",
          justifyContent: "center",
        },
        buttonGroup: {
          alignItems: "center",
          backgroundColor: isLightMode ? "#fff" : "#000",
          borderColor: isLightMode ? "#ccc" : "#333",
          color: "#8B0000",
          fontFamily: "Lato",
          justifyContent: "center",
        },
        card: {
          background: isLightMode ? "#F5F5F5" : "#111",
          borderRadius: 10,
          marginBottom: 10,
          marginLeft: 20,
          marginRight: 20,
          padding: 20,
        },
        divider: {
          height: StyleSheet.hairlineWidth,
          marginTop: 6,
          marginBottom: 6,
        },
        flexCol: {
          flex: 1,
          flexGrow: 1,
          flexDirection: "column",
          justifyContent: "space-between",
        },
        flexRow: {
          flex: 1,
          flexGrow: 1,
          flexDirection: "row",
          justifyContent: "space-between",
        },
        menu: {
          backgroundColor: isLightMode ? "#fff" : "#000",
          borderColor: isLightMode ? "#ccc" : "#333",
          borderRadius: 3,
          borderWidth: 1,
          elevation: 3,
          flex: 1,
          padding: 10,
        },
        screen: {
          flex: 1,
          height: "100%",
        },
      },
      typography: {
        // typographies
        body1: {
          color: isLightMode ? "#000" : "#fff",
          fontFamily: "Lato",
          fontSize: 16, // normal
        },
        body2: {
          color: isLightMode ? "#000" : "#fff",
          fontFamily: "Lato",
          fontSize: 14,
        },
        caption: {
          color: isLightMode ? "#000" : "#fff",
          fontFamily: "Lato",
          fontSize: 13,
        },
        code: {
          color: isLightMode ? "#000" : "#fff",
          fontFamily: "DM Mono",
          fontSize: 16, // normal
        },
        title1: {
          color: isLightMode ? "#000" : "#fff",
          fontFamily: "Lato",
          fontSize: 20,
          paddingTop: 2,
          paddingBottom: 2,
        },
        title2: {
          color: isLightMode ? "#000" : "#fff",
          fontFamily: "Lato",
          fontSize: 18,
          paddingTop: 2,
          paddingBottom: 2,
        },
        titleBold: {
          color: isLightMode ? "#000" : "#fff",
          fontFamily: "Lato",
          fontSize: 20,
          fontWeight: "bold",
        },
        subtitle1: {
          color: isLightMode ? "#000" : "#fff",
          fontFamily: "Lato",
          fontSize: 16,
          paddingTop: 2,
          paddingBottom: 2,
        },
        subtitle2: {
          color: isLightMode ? "#000" : "#fff",
          fontFamily: "Lato",
          fontSize: 15, // normal
          paddingTop: 2,
          paddingBottom: 2,
        },
        subtitle1Center: {
          color: isLightMode ? "#000" : "#fff",
          fontFamily: "Lato",
          fontSize: 16,
          paddingTop: 2,
          paddingBottom: 2,
          textAlign: "center",
          justifyContent: "center",
        },
        subtitle2Center: {
          color: isLightMode ? "#000" : "#fff",
          fontFamily: "Lato",
          fontSize: 15, // normal
          paddingTop: 2,
          paddingBottom: 2,
          textAlign: "center",
          justifyContent: "center",
        },
      },
      ...other,
    } as const),
    navContainerColors: {
      primary: "#8B0000",
      background: isLightMode ? "#FFFFFF" : "#1E1E1E",
      card: isLightMode ? "#FFFFFF" : "#1E1E1E",
      text: isLightMode ? "#212121" : "#FFFFFF",
      border: isLightMode ? "#bdbdbd" : "#757575",
      notification: "#8B0000",
    },
  };
}
