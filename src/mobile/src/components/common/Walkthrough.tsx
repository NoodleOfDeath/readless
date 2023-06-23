import React from 'react';
import { ListRenderItemInfo } from 'react-native';

import { SheetManager, SheetProps } from 'react-native-actions-sheet';
import Orientation from 'react-native-orientation-locker';

import { 
  ActionSheet,
  Button,
  Icon,
  Markdown,
  Text,
  View,
  WalkthroughSlider,
} from '~/components';
import { LayoutContext } from '~/contexts';
import { useTheme } from '~/hooks';
import { strings } from '~/locales';

export type WalkthroughStep = {
  artwork?: React.ReactNode;
  title?: React.ReactNode;
  body?: React.ReactNode;
  footer?: React.ReactNode;
  image?: string;
};

export type WalkthroughProps<Step extends WalkthroughStep = WalkthroughStep> = {
  steps: Step[];
  onDone?: () => void;
  closable?: boolean;
  closeLabel?: string;
};

export function Walkthrough<Step extends WalkthroughStep = WalkthroughStep>({ payload, ...props }: SheetProps<WalkthroughProps<Step>>) {
  
  const theme = useTheme();
  const { isTablet } = React.useContext(LayoutContext);

  const { 
    steps = [], 
    onDone,
    closable,
    closeLabel = strings.action_close,
  } = React.useMemo(() => ({ ...payload }), [payload]);
  
  const computedSteps = React.useMemo(() => {
    return steps.map((step, i) => (
      <View gap={ 12 } key={ i }>
        {typeof step.artwork === 'string' ? <Markdown subtitle1>{step.artwork}</Markdown> : step.artwork}
        <View col />
        {typeof step.title === 'string' ? <Markdown h4 bold textCenter highlightStyle={ { textDecorationLine: 'underline' } }>{step.title}</Markdown> : step.title}
        <View col />
        {typeof step.body === 'string' ? <Markdown subtitle1>{step.body}</Markdown> : step.body}
        <View col />
        {typeof step.footer === 'string' ? <Markdown subtitle1>{step.footer}</Markdown> : step.footer}
      </View>
    ));
  }, [steps]);
  
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
        itemsCenter
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
        itemsCenter
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
        px={ 10 }
        height={ 40 }
        justifyCenter
        itemsCenter
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
        itemsCenter
        borderRadius={ 24 }>
        <Icon
          name="check"
          color={ theme.colors.text }
          size={ 24 } />
      </View>
    );
  }, [theme]);

  React.useEffect(() => {
    if (isTablet) {
      return;
    }
    Orientation.lockToPortrait();
    return () => {
      Orientation.unlockAllOrientations();
    };
  }, [isTablet]);
  
  return (
    <ActionSheet 
      id={ props.sheetId }
      closable={ closable }
      gestureEnabled={ false }>
      <View height="100%">
        {closable && (
          <View flexRow m={ 12 }>
            <View flexGrow={ 1 } />
            <Button
              elevated
              flexRow
              px={ 8 }
              height={ 40 }
              justifyCenter
              touchable
              itemsCenter
              borderRadius={ 24 }
              onPress={ () => SheetManager.hide(props.sheetId) }
              leftIcon={ <Icon name="close" size={ 24 } /> }>
              {closeLabel}
            </Button>
          </View>
        )}
        <WalkthroughSlider
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