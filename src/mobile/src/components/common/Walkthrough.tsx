import React from 'react';
import { ListRenderItemInfo } from 'react-native';

import { SheetManager, SheetProps } from 'react-native-actions-sheet';
import Orientation from 'react-native-orientation-locker';

import { 
  ActionSheet,
  Button,
  Image,
  Markdown,
  View,
  WalkthroughSlider,
  WalkthroughSliderRef,
} from '~/components';
import { LayoutContext } from '~/contexts';
import { useTheme } from '~/hooks';
import { strings } from '~/locales';

export type WalkthroughStep = {
  tallImage?: boolean;
  artwork?: React.ReactNode;
  artworkBelow?: boolean;
  elevateArtwork?: boolean;
  title?: React.ReactNode;
  body?: React.ReactNode;
  footer?: React.ReactNode;
  image?: string;
};

export type WalkthroughProps<Step extends WalkthroughStep = WalkthroughStep> = {
  steps: Step[];
  onClose?: () => void;
  onDone?: () => void;
  closable?: boolean;
  closeLabel?: string;
};

export const Walkthrough = React.forwardRef(function Walkthrough<Step extends WalkthroughStep = WalkthroughStep>({ payload, ...props }: SheetProps<WalkthroughProps<Step>>, ref: React.ForwardedRef<WalkthroughSliderRef>) {
  
  const theme = useTheme();
  const {
    isTablet, screenWidth, screenHeight,
  } = React.useContext(LayoutContext);

  const { 
    steps = [], 
    onClose,
    onDone,
    closable,
    closeLabel = strings.close,
  } = React.useMemo(() => ({ ...payload }), [payload]);
  
  const computedSteps: React.ReactNode[] = React.useMemo(() => {
    return steps.map((step, i) => {
      const image = step.artwork && (
        <View 
          elevated={ step.elevateArtwork || typeof step.artwork === 'string' }
          beveled={ step.elevateArtwork || typeof step.artwork === 'string' }>
          {typeof step.artwork === 'string' ? (
            <Image 
              beveled
              native
              width={ Math.min(screenWidth, 420) - 48 }
              height={ step.tallImage ? Math.min(screenHeight * 0.6, 550) : 200 }
              source={ { uri: step.artwork } } />
          ) : (
            <View p={ 12 }>{step.artwork}</View>
          )}
        </View>
      );
      return (
        <View gap={ 12 } key={ i }>
          {!(step.artworkBelow || step.tallImage) && image}
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
          {(step.artworkBelow || step.tallImage) && image}
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
  }, [screenHeight, screenWidth, steps]);
  
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
      <Button 
        contained
        untouchable
        system
        leftIcon="arrow-left"
        iconSize={ 24 } />
    );
  }, []);
  
  const renderNextButton = React.useCallback(() => {
    return (
      <Button 
        contained
        untouchable
        system
        leftIcon="arrow-right"
        iconSize={ 24 } />
    );
  }, []);
  
  const renderSkipButton = React.useCallback(() => {
    return (
      <Button
        contained
        untouchable
        system>
        {strings.skip}
      </Button>
    );
  }, []);
  
  const renderDoneButton = React.useCallback(() => {
    return (
      <Button 
        contained
        untouchable
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
      gestureEnabled={ false }
      onClose={ onClose }>
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
          ref={ ref }
          data={ computedSteps }
          renderItem={ renderItem }
          renderPrevButton={ renderPrevButton }
          renderNextButton={ renderNextButton }
          renderSkipButton={ renderSkipButton }
          renderDoneButton={ renderDoneButton }
          onDone={ onDone }
          showPrevButton
          showNextButton
          showSkipButton
          dotStyle={ { backgroundColor: theme.colors.textDisabled } }
          activeDotStyle={ { backgroundColor: theme.colors.text } } />
      </View>
    </ActionSheet>
  );
  
}) as <Step extends WalkthroughStep = WalkthroughStep>(props: React.RefAttributes<WalkthroughSliderRef> & SheetProps<WalkthroughProps<Step>>) => React.ReactElement;