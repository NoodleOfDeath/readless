import React from 'react';
import {
  Animated,
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

type Props = {
  children: React.ReactNode | React.ReactNode[];
};

export default function AnimatedTabBar({ children }: Props) {

  const [active, setActive] = React.useState(false);
  const translateX = React.useRef(new Animated.Value(0)).current;
  const translateXTabOne = React.useRef(new Animated.Value(0)).current;
  const translateXTabTwo = React.useRef(new Animated.Value(width)).current;
  const [translateY, setTranslateY] = React.useState(-1000);
  const [xTabOne, setXTabOne] = React.useState(0);
  const [xTabTwo, setXTabTwo] = React.useState(0);

  const handleSlide = React.useCallback((type: number) => {
    Animated.spring(translateX, {
      speed: 100,
      toValue: type,
      useNativeDriver: true,
    }).start();
    if (active) {
      Animated.parallel([
        Animated.spring(translateXTabOne, {
          speed: 100,
          toValue: 0,
          useNativeDriver: true,
        }),
        Animated.spring(translateXTabTwo, {
          speed: 100,
          toValue: width,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(translateXTabOne, {
          speed: 100,
          toValue: -width,
          useNativeDriver: true,
        }),
        Animated.spring(translateXTabTwo, {
          speed: 100,
          toValue: 0,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [active, translateX, translateXTabOne, translateXTabTwo]);

  return (
    <View style={ { flex: 1 } }>
      <View
        style={ {
          marginLeft: 'auto',
          marginRight: 'auto',
          width: '90%',
        } }>
        <View
          style={ {
            flexDirection: 'row',
            height: 36,
            marginBottom: 20,
            marginTop: 40,
            position: 'relative',
          } }>
          <Animated.View
            style={ {
              backgroundColor: '#007aff',
              borderRadius: 4,
              height: '100%',
              left: 0,
              position: 'absolute',
              top: 0,
              transform: [
                { translateX },
              ],
              width: '50%',
            } } />
          <TouchableOpacity
            style={ {
              alignItems: 'center',
              borderBottomRightRadius: 0,
              borderColor: '#007aff',
              borderRadius: 4,
              borderRightWidth: 0,
              borderTopRightRadius: 0,
              borderWidth: 1,
              flex: 1,
              justifyContent: 'center',
            } }
            onLayout={ event =>
              setXTabOne(event.nativeEvent.layout.x) }
            onPress={ () => {
              setActive(true); handleSlide(xTabOne);
            } }>
            <Text
              style={ { color: !active ? '#fff' : '#007aff' } }>
              Tab One
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={ {
              alignItems: 'center',
              borderBottomLeftRadius: 0,
              borderColor: '#007aff',
              borderLeftWidth: 0,
              borderRadius: 4,
              borderTopLeftRadius: 0,
              borderWidth: 1,
              flex: 1,
              justifyContent: 'center',
            } }
            onLayout={ event =>
              setXTabTwo(event.nativeEvent.layout.x) }
            onPress={ () => {
              setActive(true); handleSlide(xTabTwo);
            } }>
            <Text
              style={ { color: active ? '#fff' : '#007aff' } }>
              Tab Two
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView>
          <Animated.View
            style={ {
              alignItems: 'center',
              justifyContent: 'center',
              transform: [
                { translateX: translateXTabOne },
              ],
            } }
            onLayout={ event =>
              setTranslateY(event.nativeEvent.layout.height) }>
            <View />
          </Animated.View>

          <Animated.View
            style={ {
              alignItems: 'center',
              justifyContent: 'center',
              transform: [
                { translateX: translateXTabTwo },
                { translateY: -translateY },
              ],
            } }>
            <Text>Hi, I am a cute dog</Text>
            <View />
          </Animated.View>
        </ScrollView>
      </View>
    </View>
  );

}