import React from 'react';
import { ListRenderItemInfo } from 'react-native';

import { SheetManager, SheetProps } from 'react-native-actions-sheet';
import Orientation from 'react-native-orientation-locker';

import { 
  ActionSheet,
  Button,
  Chip,
  Image,
  Markdown,
  View,
  WalkthroughSlider,
} from '~/components';
import { LayoutContext } from '~/contexts';
import { useTheme } from '~/hooks';
import { strings } from '~/locales';

export type WalkthroughStep = {
  artwork?: React.ReactNode;
  artworkBelow?: boolean;
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
    return steps.map((step, i) => {
      const image = 
    typeof step.artwork === 'string' ? (
      <Image 
        rounded
        overflow='hidden'
        elevated
        width='100%'
        height={ 200 }
        source={ { uri: step.artwork } } />
    ) : step.artwork;
      return (
        <View gap={ 12 } key={ i }>
          {!step.artworkBelow && image}
          {typeof step.title === 'string' ? (
            <Markdown 
              h4
              bold
              textCenter
              system
              highlightStyle={ { textDecorationLine: 'underline' } }>
              {step.title}
            </Markdown>
          ) : step.title}
          {step.artworkBelow && image}
          {typeof step.body === 'string' ? (
            <Markdown 
              subtitle1
              system>
              {step.body}
            </Markdown>
          ) : step.body}
          {typeof step.footer === 'string' ? (
            <Markdown 
              subtitle1
              system>
              {step.footer}
            </Markdown>
          ) : step.footer}
        </View>
      );
    });
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
      <Chip 
        contained
        system
        leftIcon="arrow-left"
        iconSize={ 24 } />
    );
  }, []);
  
  const renderNextButton = React.useCallback(() => {
    return (
      <Chip 
        contained
        system
        leftIcon="arrow-right"
        iconSize={ 24 } />
    );
  }, []);
  
  const renderSkipButton = React.useCallback(() => {
    return (
      <Chip
        contained
        system>
        {strings.action_skip}
      </Chip>
    );
  }, []);
  
  const renderDoneButton = React.useCallback(() => {
    return (
      <Chip 
        contained
        system
        leftIcon="check"
        iconSize={ 24 } />
    );
  }, []);

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
              system
              contained
              onPress={ () => SheetManager.hide(props.sheetId) }
              leftIcon='close'
              iconSize={ 24 }>
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