import React from 'react';
import { ListRenderItemInfo } from 'react-native';

import { SheetManager, SheetProps } from 'react-native-actions-sheet';
import AppIntroSlider from 'react-native-app-intro-slider';

import { 
  ActionSheet,
  Button,
  Icon,
  Markdown,
  Text,
  View,
} from '~/components';
import { useTheme } from '~/hooks';
import { strings } from '~/locales';

export type WalkthroughStep = {
  title?: React.ReactNode;
  body?: React.ReactNode;
  footer?: React.ReactNode;
  doneLabel?: React.ReactNode;
  image?: string;
};

export type WalkthroughProps = {
  steps: WalkthroughStep[];
  onDone?: () => void;
};

export function Walkthrough({ payload, ...props }: SheetProps<WalkthroughProps>) {
  
  const theme = useTheme();

  const { steps = [], onDone } = React.useMemo(() => ({ ...payload }), [payload]);
  
  const computedSteps = React.useMemo(() => steps.map((step, i) => (
    <View gap={ 12 } key={ i }>
      {typeof step.title === 'string' ? <Text h5 bold textCenter>{step.title}</Text> : step.title}
      {typeof step.body === 'string' ? <Markdown>{step.body}</Markdown> : step.body}
      {typeof step.footer === 'string' ? <Markdown>{step.footer}</Markdown> : step.footer}
    </View>
  )), [steps]);
  
  const renderItem = React.useCallback(({ item }: ListRenderItemInfo<React.ReactNode>) => {
    return (
      <View 
        flexGrow={ 1 }
        p={ 32 }
        justifyCenter>
        {item}
      </View>
    );
  }, []);
  
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
  
  const renderSkipButton = React.useCallback(() => {
    return (
      <View 
        elevated
        ph={ 10 }
        height={ 40 }
        justifyCenter
        alignCenter
        borderRadius={ 24 }>
        <Text>{strings.action_skip}</Text>
      </View>
    );
  }, []);
  
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
    <ActionSheet id={ props.sheetId } gestureEnabled={ false }>
      <View height="100%">
        <View flexRow m={ 12 }>
          <View flexGrow={ 1 } />
          <Button
            elevated
            flexRow
            ph={ 8 }
            height={ 40 }
            justifyCenter
            touchable
            alignCenter
            borderRadius={ 24 }
            onPress={ () => SheetManager.hide(props.sheetId) }
            leftIcon={ <Icon name="close" size={ 24 } /> }>
            {strings.action_close}
          </Button>
        </View>
        <AppIntroSlider
          renderItem={ renderItem }
          renderPrevButton={ renderPrevButton }
          renderNextButton={ renderNextButton }
          renderSkipButton={ renderSkipButton }
          renderDoneButton={ renderDoneButton }
          onDone={ onDone }
          showPrevButton
          showSkipButton
          dotStyle={ { backgroundColor: theme.colors.textDisabled } }
          activeDotStyle={ { backgroundColor: theme.colors.text } }
          data={ computedSteps } />
      </View>
    </ActionSheet>
  );
  
}