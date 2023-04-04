import { StyleSheet, useColorScheme } from 'react-native';

// eslint-disable-next-line @typescript-eslint/ban-types
export function useTheme<T extends {}>(other: T = {} as T) {
  const isLightMode = useColorScheme() === 'light';
  return {
    colors: {
      contrastText: '#fff',
      error: '#f44336',
      primary: '#8b0000',
      text: isLightMode ? '#000' : '#fff',
    },
    isLightMode,
    ...StyleSheet.create({
      components: {
        // containers
        buttonGroup: {
          backgroundColor: isLightMode ? '#fff' : '#000',
          marginTop: 8,
          overflow: 'hidden',
          width: '100%',
        },
        buttonGroupRow: { width: '100%' },
        buttonSelected: {
          backgroundColor: '#8b0000',
          color: '#fff',
        },
        buttonText: { padding: 4 },
        card: {
          backgroundColor: isLightMode ? '#eee' : '#111',
          marginBottom: 8,
          marginLeft: 16,
          marginRight: 16,
          padding: 16,
        },
        category: {
          backgroundColor: '#8b0000',
          marginBottom: 8,
          padding: 8,
        },
        dialog: {
          backgroundColor: isLightMode ? '#eee' : '#111',
          borderColor: '#8b0000',
          borderRadius: 8,
          borderWidth: 3,
          minHeight: '60%',
          minWidth: '70%',
        },
        dialogBackdrop: {
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          height: '100%',
          justifyContent: 'center',
          position: 'absolute',
          width: '100%',
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
        input: { color: isLightMode ? '#000' : '#fff' },
        outlined: {
          borderColor: '#8b0000',
          borderWidth: 2,
        },
        rounded: { borderRadius: 8 },
        searchBar: {
          backgroundColor: isLightMode ? '#fff' : '#000',
          borderRadius: 8,
          marginBottom: 8,
          marginTop: 8,
          overflow: 'hidden',
          width: '100%',
        },
      },
      typography: {
        // typographies
        body1: {
          fontFamily: 'Lato',
          fontSize: 16, // normal
        },
        body2: {
          fontFamily: 'Lato',
          fontSize: 14,
        },
        caption: {
          fontFamily: 'Lato',
          fontSize: 13,
        },
        code: {
          fontFamily: 'DM Mono',
          fontSize: 16, // normal
        },
        subtitle1: {
          fontFamily: 'Lato',
          fontSize: 16,
          paddingBottom: 2,
          paddingTop: 2,
        },
        subtitle1Center: {
          fontFamily: 'Lato',
          fontSize: 16,
          justifyContent: 'center',
          paddingBottom: 2,
          paddingTop: 2,
          textAlign: 'center',
        },
        subtitle2: {
          fontFamily: 'Lato',
          fontSize: 15, 
          paddingBottom: 2,
          // normal
          paddingTop: 2,
        },
        title1: {
          fontFamily: 'Lato',
          fontSize: 20,
          paddingBottom: 2,
          paddingTop: 2,
        },
        title2: {
          fontFamily: 'Lato',
          fontSize: 18,
          paddingBottom: 2,
          paddingTop: 2,
        },
        titleBold: {
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
      notification: '#8b0000',
      primary: '#8b0000',
      text: isLightMode ? '#212121' : '#FFFFFF',
    },
  };
}
