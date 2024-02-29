import * as React from 'react';
import {
  FlatList,
  FlatListProps,
  GestureResponderEvent,
  I18nManager,
  LayoutChangeEvent,
  ListRenderItemInfo,
  NativeScrollEvent,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

function areInputsEqual(
  newInputs: readonly unknown[],
  lastInputs: readonly unknown[]
): boolean {
  // Using for loop for speed. It generally performs better than array.every
  // https://github.com/alexreardon/memoize-one/pull/59
  for (let i = 0; i < newInputs.length; i++) {
    // using shallow equality check
    if (newInputs[i] !== lastInputs[i]) {
      return false;
    }
  }
  return true;
}

let lastArgs: unknown[] = [];
let lastResult = 0;

function mergeExtraData(...newArgs: unknown[]): number {
  if (areInputsEqual(newArgs, lastArgs)) {
    return lastResult;
  }
  // Something shallowly changed - return a new number from [0-10]
  lastResult = lastResult === 10 ? 0 : lastResult + 1;
  lastArgs = newArgs;
  return lastResult;
}

const isAndroidRTL = I18nManager.isRTL && Platform.OS === 'android';

export type WalkthroughSliderProps<ItemT> = FlatListProps<ItemT> & {
  data: ItemT[];
  renderItem: (
    info: ListRenderItemInfo<ItemT> & {
      dimensions: { width: number; height: number };
    },
  ) => React.ReactNode;
  renderSkipButton?: () => React.ReactNode;
  renderNextButton?: () => React.ReactNode;
  renderDoneButton?: () => React.ReactNode;
  renderPrevButton?: () => React.ReactNode;
  onSlideChange?: (a: number, b: number) => void;
  onSkip?: () => void;
  onDone?: () => void;
  renderPagination?: (activeIndex: number) => React.ReactNode;
  activeDotStyle: ViewStyle;
  dotStyle: ViewStyle;
  dotClickEnabled: boolean;
  skipLabel: string;
  doneLabel: string;
  nextLabel: string;
  prevLabel: string;
  showDoneButton: boolean;
  showNextButton: boolean;
  showPrevButton: boolean;
  showSkipButton: boolean;
  bottomButton: boolean;
};

type State = {
  width: number;
  height: number;
  activeIndex: number;
};

export type WalkthroughSliderRef = {
  goToSlide?: (a: number, b?: boolean) => void;
  next?: () => void;  
  prev?: () => void;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const WalkthroughSlider = React.forwardRef(function WalkthroughSlider<ItemT>({
  data,
  activeIndex: activeIndex0 = 0,
  width: width0,
  height: height0,
  onSlideChange,
  renderItem,
  renderSkipButton,
  renderNextButton,
  renderDoneButton,
  renderPrevButton,
  onSkip,
  onDone,
  renderPagination,
  activeDotStyle,
  dotStyle,
  dotClickEnabled,
  skipLabel,
  doneLabel,
  nextLabel,
  prevLabel,
  showDoneButton,
  showNextButton,
  showPrevButton,
  showSkipButton,
  bottomButton,
  ...props
}: State & WalkthroughSliderProps<ItemT>, ref: React.ForwardedRef<WalkthroughSliderRef>) {

  const [activeIndex, setActiveIndex] = React.useState(activeIndex0);
  const [width, setWidth] = React.useState(width0);
  const [height, setHeight] = React.useState(height0);

  const flatList = React.useRef<FlatList<ItemT>>(null);

  // Index that works across Android's weird rtl bugs
  const _rtlSafeIndex = React.useCallback((i: number) =>
    isAndroidRTL ? data.length - 1 - i : i, [data]);

  // Render a slide
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const _renderItem = React.useCallback((flatListArgs: any) => {
    const props = { ...flatListArgs, dimensions: { height, width } };
    // eslint-disable-next-line react-native/no-inline-styles
    return <View style={ { flex: 1, width } }>{renderItem(props)}</View>;
  }, [height, width, renderItem]);

  const renderDefaultButton = React.useCallback((name: string, label: string) => {
    let content = <Text style={ styles.buttonText }>{label}</Text>;
    if (bottomButton) {
      content = (
        <View
          style={ [
            name === 'Skip' || name === 'Prev'
              ? styles.transparentBottomButton
              : styles.bottomButton,
          ] }>
          {content}
        </View>
      );
    }
    return content;
  }, [bottomButton]);

  const renderOuterButton = React.useCallback((
    content: React.ReactNode,
    name: string,
    onPress?: (e: GestureResponderEvent) => void
  ) => {
    const style =
      name === 'Skip' || name === 'Prev'
        ? styles.leftButtonContainer
        : styles.rightButtonContainer;
    return (
      <View style={ !bottomButton && style }>
        <TouchableOpacity
          onPress={ onPress }
          style={ bottomButton && styles.flexOne }>
          {content}
        </TouchableOpacity>
      </View>
    );
  }, [bottomButton]);

  const _renderButton = React.useCallback((
    name: string,
    label: string,
    onPress?: () => void,
    render?: () => React.ReactNode
  ) => {
    const content = render ? render() : renderDefaultButton(name, label);
    return renderOuterButton(content, name, onPress);
  }, [renderDefaultButton, renderOuterButton]);

  const goToSlide = React.useCallback((pageNum: number, triggerOnSlideChange?: boolean) => {
    const prevNum = activeIndex;
    setActiveIndex(pageNum);
    flatList.current?.scrollToOffset({ offset: _rtlSafeIndex(pageNum) * width });
    if (triggerOnSlideChange && onSlideChange) {
      onSlideChange?.(pageNum, prevNum);
    }
  }, [_rtlSafeIndex, activeIndex, onSlideChange, width]);

  const _renderNextButton = React.useCallback(() =>
    showNextButton &&
    _renderButton(
      'Next',
      nextLabel,
      () => goToSlide(activeIndex + 1, true),
      renderNextButton
    ), [_renderButton, activeIndex, goToSlide, nextLabel, renderNextButton, showNextButton]);

  const _renderPrevButton = React.useCallback(() =>
    showPrevButton &&
    _renderButton(
      'Prev',
      prevLabel,
      () => goToSlide(activeIndex - 1, true),
      renderPrevButton
    ), [_renderButton, activeIndex, goToSlide, prevLabel, renderPrevButton, showPrevButton]);

  const _renderDoneButton = React.useCallback(() =>
    showDoneButton &&
    _renderButton(
      'Done',
      doneLabel,
      onDone,
      renderDoneButton
    ), [_renderButton, doneLabel, onDone, renderDoneButton, showDoneButton]);

  const _renderSkipButton = React.useCallback(() =>
    // scrollToEnd does not work in RTL so use goToSlide instead
    showSkipButton &&
    _renderButton(
      'Skip',
      skipLabel,
      () =>
        onSkip
          ? onSkip()
          : goToSlide(data.length - 1),
      renderSkipButton
    ), [_renderButton, data.length, goToSlide, onSkip, renderSkipButton, showSkipButton, skipLabel]);

  const _renderPagination = React.useCallback(() => {
    const isLastSlide = activeIndex === data.length - 1;
    const isFirstSlide = activeIndex === 0;

    const secondaryButton =
      (!isFirstSlide && _renderPrevButton()) ||
      (!isLastSlide && _renderSkipButton());
    const primaryButton = isLastSlide
      ? _renderDoneButton()
      : _renderNextButton();

    return (
      <View style={ styles.paginationContainer }>
        <SafeAreaView>
          <View style={ styles.paginationDots }>
            {data.length > 1 &&
              data.map((_, i) =>
                dotClickEnabled ? (
                  <TouchableOpacity
                    key={ i }
                    style={ [
                      styles.dot,
                      _rtlSafeIndex(i) === activeIndex
                        ? activeDotStyle
                        : dotStyle,
                    ] }
                    onPress={ () => goToSlide(i, true) } />
                ) : (
                  <View
                    key={ i }
                    style={ [
                      styles.dot,
                      _rtlSafeIndex(i) === activeIndex
                        ? activeDotStyle
                        : dotStyle,
                    ] } />
                ))}
          </View>
          {primaryButton}
          {secondaryButton}
        </SafeAreaView>
      </View>
    );
  }, [activeIndex, data, _renderPrevButton, _renderSkipButton, _renderDoneButton, _renderNextButton, dotClickEnabled, _rtlSafeIndex, activeDotStyle, dotStyle, goToSlide]);

  const onMomentumScrollEnd = React.useCallback((e: {nativeEvent: NativeScrollEvent}) => {
    const offset = e.nativeEvent.contentOffset.x;
    // Touching very very quickly and continuous brings about
    // a variation close to - but not quite - the width.
    // That's why we round the number.
    // Also, Android phones and their weird numbers
    const newIndex = _rtlSafeIndex(Math.round(offset / width));
    if (newIndex === activeIndex) {
      // No page change, don't do anything
      return;
    }
    const lastIndex = activeIndex;
    setActiveIndex(newIndex);
    onSlideChange?.(newIndex, lastIndex);
  }, [_rtlSafeIndex, width, activeIndex, onSlideChange]);

  const onLayout = React.useCallback(({ nativeEvent }: LayoutChangeEvent) => {
    const { layout } = nativeEvent;
    if (layout.width !== width || layout.height !== height) {
      // Set new width to update rendering of pages
      setWidth(layout.width);
      setHeight(layout.height);
      // Set new scroll position
      const func = () => {
        flatList.current?.scrollToOffset({
          animated: false,
          offset: _rtlSafeIndex(activeIndex) * layout.width,
        });
      };
      setTimeout(func, 0); // Must be called like this to avoid bugs :/
    }
  }, [width, height, _rtlSafeIndex, activeIndex]);

  React.useImperativeHandle(ref, () => ({
    goToSlide, 
    next: () => activeIndex + 1 < data.length && goToSlide(activeIndex + 1, true), 
    prev: () => activeIndex - 1 > 0 && goToSlide(activeIndex - 1, true), 
  }));

  const extra = React.useMemo(() => mergeExtraData(props.extraData, width), [props.extraData, width]);

  return (
    <View style={ styles.flexOne }>
      <FlatList
        ref={ flatList }
        data={ data }
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={ false }
        bounces={ false }
        style={ styles.flatList }
        renderItem={ _renderItem }
        onMomentumScrollEnd={ onMomentumScrollEnd }
        extraData={ extra }
        onLayout={ onLayout }
        // make sure all slides are rendered so we can use dots to navigate to them
        initialNumToRender={ data.length }
        { ...props } />
      {renderPagination
        ? renderPagination(activeIndex)
        : _renderPagination()}
    </View>
  );

}) as <ItemT>(props: Partial<State & WalkthroughSliderProps<ItemT>> & React.RefAttributes<WalkthroughSliderRef>) => React.ReactElement;

const styles = StyleSheet.create({
  bottomButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, .3)',
    flex: 1,
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    padding: 12,
  },
  dot: {
    borderRadius: 5,
    height: 10,
    marginHorizontal: 4,
    width: 10,
  },
  flatList: {
    flex: 1,
    flexDirection: isAndroidRTL ? 'row-reverse' : 'row',
  },
  flexOne: { flex: 1 },
  leftButtonContainer: {
    left: 0,
    position: 'absolute',
  },
  paginationContainer: {
    bottom: 16,
    justifyContent: 'center',
    left: 16,
    position: 'absolute',
    right: 16,
  },
  paginationDots: {
    alignItems: 'center',
    flexDirection: isAndroidRTL ? 'row-reverse' : 'row',
    height: 16,
    justifyContent: 'center',
    margin: 16,
  },
  rightButtonContainer: {
    position: 'absolute',
    right: 0,
  },
  transparentBottomButton: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});