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
      dimensions: {width: number; height: number};
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
} & FlatListProps<ItemT>;

type State = {
  width: number;
  height: number;
  activeIndex: number;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class WalkthroughSlider<ItemT = any> extends React.Component<
  WalkthroughSliderProps<ItemT>,
  State
> {

  static defaultProps = {
    activeDotStyle: { backgroundColor: 'rgba(255, 255, 255, .9)' },
    bottomButton: false,
    doneLabel: 'Done',
    dotClickEnabled: true,
    dotStyle: { backgroundColor: 'rgba(0, 0, 0, .2)' },
    nextLabel: 'Next',
    prevLabel: 'Back',
    showDoneButton: true,
    showNextButton: true,
    showPrevButton: false,
    showSkipButton: false,
    skipLabel: 'Skip',
  };

  state = {
    activeIndex: 0,
    height: 0,
    width: 0,
  };

  flatList: FlatList<ItemT> | undefined;

  goToSlide = (pageNum: number, triggerOnSlideChange?: boolean) => {
    const prevNum = this.state.activeIndex;
    this.setState({ activeIndex: pageNum });
    this.flatList?.scrollToOffset({ offset: this._rtlSafeIndex(pageNum) * this.state.width });
    if (triggerOnSlideChange && this.props.onSlideChange) {
      this.props.onSlideChange(pageNum, prevNum);
    }
  };

  // Get the list ref
  getListRef = () => this.flatList;

  // Index that works across Android's weird rtl bugs
  _rtlSafeIndex = (i: number) =>
    isAndroidRTL ? this.props.data.length - 1 - i : i;

  // Render a slide
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _renderItem = (flatListArgs: any) => {
    const { width, height } = this.state;
    const props = { ...flatListArgs, dimensions: { height, width } };
    // eslint-disable-next-line react-native/no-inline-styles
    return <View style={ { flex: 1, width } }>{this.props.renderItem(props)}</View>;
  };

  _renderButton = (
    name: string,
    label: string,
    onPress?: () => void,
    render?: () => React.ReactNode
  ) => {
    const content = render ? render() : this._renderDefaultButton(name, label);
    return this._renderOuterButton(content, name, onPress);
  };

  _renderDefaultButton = (name: string, label: string) => {
    let content = <Text style={ styles.buttonText }>{label}</Text>;
    if (this.props.bottomButton) {
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
  };

  _renderOuterButton = (
    content: React.ReactNode,
    name: string,
    onPress?: (e: GestureResponderEvent) => void
  ) => {
    const style =
      name === 'Skip' || name === 'Prev'
        ? styles.leftButtonContainer
        : styles.rightButtonContainer;
    return (
      <View style={ !this.props.bottomButton && style }>
        <TouchableOpacity
          onPress={ onPress }
          style={ this.props.bottomButton && styles.flexOne }>
          {content}
        </TouchableOpacity>
      </View>
    );
  };

  _renderNextButton = () =>
    this.props.showNextButton &&
    this._renderButton(
      'Next',
      this.props.nextLabel,
      () => this.goToSlide(this.state.activeIndex + 1, true),
      this.props.renderNextButton
    );

  _renderPrevButton = () =>
    this.props.showPrevButton &&
    this._renderButton(
      'Prev',
      this.props.prevLabel,
      () => this.goToSlide(this.state.activeIndex - 1, true),
      this.props.renderPrevButton
    );

  _renderDoneButton = () =>
    this.props.showDoneButton &&
    this._renderButton(
      'Done',
      this.props.doneLabel,
      this.props.onDone,
      this.props.renderDoneButton
    );

  _renderSkipButton = () =>
    // scrollToEnd does not work in RTL so use goToSlide instead
    this.props.showSkipButton &&
    this._renderButton(
      'Skip',
      this.props.skipLabel,
      () =>
        this.props.onSkip
          ? this.props.onSkip()
          : this.goToSlide(this.props.data.length - 1),
      this.props.renderSkipButton
    );

  _renderPagination = () => {
    const isLastSlide = this.state.activeIndex === this.props.data.length - 1;
    const isFirstSlide = this.state.activeIndex === 0;

    const secondaryButton =
      (!isFirstSlide && this._renderPrevButton()) ||
      (!isLastSlide && this._renderSkipButton());
    const primaryButton = isLastSlide
      ? this._renderDoneButton()
      : this._renderNextButton();

    return (
      <View style={ styles.paginationContainer }>
        <SafeAreaView>
          <View style={ styles.paginationDots }>
            {this.props.data.length > 1 &&
              this.props.data.map((_, i) =>
                this.props.dotClickEnabled ? (
                  <TouchableOpacity
                    key={ i }
                    style={ [
                      styles.dot,
                      this._rtlSafeIndex(i) === this.state.activeIndex
                        ? this.props.activeDotStyle
                        : this.props.dotStyle,
                    ] }
                    onPress={ () => this.goToSlide(i, true) } />
                ) : (
                  <View
                    key={ i }
                    style={ [
                      styles.dot,
                      this._rtlSafeIndex(i) === this.state.activeIndex
                        ? this.props.activeDotStyle
                        : this.props.dotStyle,
                    ] } />
                ))}
          </View>
          {primaryButton}
          {secondaryButton}
        </SafeAreaView>
      </View>
    );
  };

  _onMomentumScrollEnd = (e: {nativeEvent: NativeScrollEvent}) => {
    const offset = e.nativeEvent.contentOffset.x;
    // Touching very very quickly and continuous brings about
    // a variation close to - but not quite - the width.
    // That's why we round the number.
    // Also, Android phones and their weird numbers
    const newIndex = this._rtlSafeIndex(Math.round(offset / this.state.width));
    if (newIndex === this.state.activeIndex) {
      // No page change, don't do anything
      return;
    }
    const lastIndex = this.state.activeIndex;
    this.setState({ activeIndex: newIndex });
    this.props.onSlideChange && this.props.onSlideChange(newIndex, lastIndex);
  };

  _onLayout = ({ nativeEvent }: LayoutChangeEvent) => {
    const { width, height } = nativeEvent.layout;
    if (width !== this.state.width || height !== this.state.height) {
      // Set new width to update rendering of pages
      this.setState({ height, width });
      // Set new scroll position
      const func = () => {
        this.flatList?.scrollToOffset({
          animated: false,
          offset: this._rtlSafeIndex(this.state.activeIndex) * width,
        });
      };
      setTimeout(func, 0); // Must be called like this to avoid bugs :/
    }
  };

  render() {
    // Separate props used by the component to props passed to FlatList
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const {
      renderPagination,
      activeDotStyle,
      dotStyle,
      skipLabel,
      doneLabel,
      nextLabel,
      prevLabel,
      renderItem,
      data,
      extraData,
      ...otherProps
    } = this.props;
    /* eslint-enable @typescript-eslint/no-unused-vars */

    // Merge component width and user-defined extraData
    const extra = mergeExtraData(extraData, this.state.width);

    return (
      <View style={ styles.flexOne }>
        <FlatList
          ref={ (ref) => (this.flatList = ref as FlatList<ItemT>) }
          data={ this.props.data }
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={ false }
          bounces={ false }
          style={ styles.flatList }
          renderItem={ this._renderItem }
          onMomentumScrollEnd={ this._onMomentumScrollEnd }
          extraData={ extra }
          onLayout={ this._onLayout }
          // make sure all slides are rendered so we can use dots to navigate to them
          initialNumToRender={ data.length }
          { ...otherProps } />
        {renderPagination
          ? renderPagination(this.state.activeIndex)
          : this._renderPagination()}
      </View>
    );
  }

}

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