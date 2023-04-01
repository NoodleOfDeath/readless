import { StyleSheet, useColorScheme } from 'react-native';

// eslint-disable-next-line @typescript-eslint/ban-types
export function useTheme<T extends {}>(other: T = {} as T) {
  const isLightMode = useColorScheme() === 'light';
  return {
    isLightMode,
    ...StyleSheet.create({
      components: {
        // containers
        button: {
          alignItems: 'center',
          color: '#f5af40',
          fontFamily: 'Lato',
          justifyContent: 'center',
        },
        buttonBlock: {
          alignItems: 'center',
          backgroundColor: isLightMode ? '#fff' : '#000',
          color: '#f5af40',
          fontFamily: 'Lato',
          justifyContent: 'center',
          padding: 10,
        },
        buttonDisabled: {
          alignItems: 'center',
          color: isLightMode ? '#ccc' : '#333',
          fontFamily: 'Lato',
          justifyContent: 'center',
        },
        buttonGroup: {
          alignItems: 'center',
          backgroundColor: isLightMode ? '#fff' : '#000',
          borderColor: isLightMode ? '#ccc' : '#333',
          color: '#f5af40',
          fontFamily: 'Lato',
          justifyContent: 'center',
        },
        buttonPadded: {
          alignItems: 'center',
          color: '#f5af40',
          fontFamily: 'Lato',
          justifyContent: 'center',
          padding: 10,
        },
        card: {
          background: isLightMode ? '#F5F5F5' : '#111',
          borderRadius: 10,
          marginBottom: 10,
          marginLeft: 20,
          marginRight: 20,
          padding: 20,
        },
        divider: {
          height: StyleSheet.hairlineWidth,
          marginBottom: 6,
          marginTop: 6,
        },
        flexCol: {
          flex: 1,
          flexDirection: 'column',
          flexGrow: 1,
          justifyContent: 'space-between',
        },
        flexRow: {
          flex: 1,
          flexDirection: 'row',
          flexGrow: 1,
          justifyContent: 'space-between',
        },
        menu: {
          backgroundColor: isLightMode ? '#fff' : '#000',
          borderColor: isLightMode ? '#ccc' : '#333',
          borderRadius: 3,
          borderWidth: 1,
          elevation: 3,
          flex: 1,
          padding: 10,
        },
        screen: {
          flex: 1,
          height: '100%',
        },
      },
      typography: {
        // typographies
        body1: {
          color: isLightMode ? '#000' : '#fff',
          fontFamily: 'Lato',
          fontSize: 16, // normal
        },
        body2: {
          color: isLightMode ? '#000' : '#fff',
          fontFamily: 'Lato',
          fontSize: 14,
        },
        caption: {
          color: isLightMode ? '#000' : '#fff',
          fontFamily: 'Lato',
          fontSize: 13,
        },
        code: {
          color: isLightMode ? '#000' : '#fff',
          fontFamily: 'DM Mono',
          fontSize: 16, // normal
        },
        subtitle1: {
          color: isLightMode ? '#000' : '#fff',
          fontFamily: 'Lato',
          fontSize: 16,
          paddingBottom: 2,
          paddingTop: 2,
        },
        subtitle1Center: {
          color: isLightMode ? '#000' : '#fff',
          fontFamily: 'Lato',
          fontSize: 16,
          justifyContent: 'center',
          paddingBottom: 2,
          paddingTop: 2,
          textAlign: 'center',
        },
        subtitle2: {
          color: isLightMode ? '#000' : '#fff',
          fontFamily: 'Lato',
          fontSize: 15, 
          paddingBottom: 2,
          // normal
          paddingTop: 2,
        },
        subtitle2Center: {
          color: isLightMode ? '#000' : '#fff',
          fontFamily: 'Lato',
          fontSize: 15, 
          justifyContent: 'center',
          
          paddingBottom: 2,
          // normal
          paddingTop: 2,
          textAlign: 'center',
        },
        title1: {
          color: isLightMode ? '#000' : '#fff',
          fontFamily: 'Lato',
          fontSize: 20,
          paddingBottom: 2,
          paddingTop: 2,
        },
        title2: {
          color: isLightMode ? '#000' : '#fff',
          fontFamily: 'Lato',
          fontSize: 18,
          paddingBottom: 2,
          paddingTop: 2,
        },
        titleBold: {
          color: isLightMode ? '#000' : '#fff',
          fontFamily: 'Lato',
          fontSize: 20,
          fontWeight: 'bold',
        },
      },
      ...other,
    } as const),
    navContainerColors: {
      background: isLightMode ? '#FFFFFF' : '#1E1E1E',
      border: isLightMode ? '#bdbdbd' : '#757575',
      card: isLightMode ? '#FFFFFF' : '#1E1E1E',
      notification: '#f5af40',
      primary: '#f5af40',
      text: isLightMode ? '#212121' : '#FFFFFF',
    },
  };
}
