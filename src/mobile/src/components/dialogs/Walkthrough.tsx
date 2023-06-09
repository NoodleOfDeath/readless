import React from 'react';
import { ListRenderItemInfo } from 'react-native';

import { SheetProps } from 'react-native-actions-sheet';
import AppIntroSlider from 'react-native-app-intro-slider';

import { 
  ActionSheet,
  Button,
  Icon,
  Text,
  View,
} from '~/components';
import { useTheme } from '~/hooks';

export type WalkthroughProps = {
  steps: React.ReactNode[];
  onDone?: () => void;
};

export function Walkthrough({ payload, ...props }: SheetProps<WalkthroughProps>) {
  
  const theme = useTheme();

  const { steps = [], onDone } = React.useMemo(() => ({ ...payload }), [payload]);
  
  const renderItem = React.useCallback(({ item }: ListRenderItemInfo<React.ReactNode>) => {
    return (
      <View 
        col 
        alignCenter
        justifyCenter
        p={ 32 }>
        <View
          p={ 32 }
          style={ theme.components.card }
          alignCenter
          justifyCenter>
          {item}
        </View>
      </View>
    );
  }, [theme]);
  
  const renderPrevButton = React.useCallback(() => {
    return (
      <View 
        elevated
        width={ 40 }
        height={ 40 }
        justifyCenter
        alignCenter
        borderRadius={ 24 }>
        <Icon
          name="arrow-left"
          color={ theme.colors.text }
          size={ 24 } />
      </View>
    );
  }, [theme]);
  
  const renderNextButton = React.useCallback(() => {
    return (
      <View 
        elevated
        width={ 40 }
        height={ 40 }
        justifyCenter
        alignCenter
        borderRadius={ 24 }>
        <Icon
          name="arrow-right"
          color={ theme.colors.text }
          size={ 24 } />
      </View>
    );
  }, [theme]);
  
  const renderDoneButton = React.useCallback(() => {
    return (
      <View 
        elevated
        width={ 40 }
        height={ 40 }
        justifyCenter
        alignCenter
        borderRadius={ 24 }>
        <Icon
          name="check"
          color={ theme.colors.text }
          size={ 24 } />
      </View>
    );
  }, [theme]);
  
  return (
    <ActionSheet id={ props.sheetId }>
      <View height={ 500 }>
        <AppIntroSlider
          renderItem={ renderItem }
          renderPrevButton={ renderPrevButton }
          renderNextButton={ renderNextButton }
          renderDoneButton={ renderDoneButton }
          onDone={ onDone }
          showPrevButton
          dotStyle={ { backgroundColor: theme.colors.textDisabled } }
          activeDotStyle={ { backgroundColor: theme.colors.text } }
          data={ steps } />
      </View>
    </ActionSheet>
  );
  
}