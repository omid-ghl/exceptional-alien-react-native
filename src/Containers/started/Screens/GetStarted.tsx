import React, {useRef, useState} from 'react';
import {View, StyleSheet, StatusBar} from 'react-native';
import {useTranslation} from 'react-i18next';

import {colors, images, variables} from '@/Theme';
import Carousel from 'react-native-reanimated-carousel';
import {
  CarouselRenderItem,
  ICarouselInstance,
} from 'react-native-reanimated-carousel/lib/typescript/types';
import CarouselItem from '../Components/CarouselItem';
import Animated, {
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import GetStartedButton from '../Components/GetStartedButton';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StackParamList} from '@/Navigators/Stacks';
import {StackScreenProps} from '@react-navigation/stack';

const GetStarted: React.FC<StackScreenProps<StackParamList, 'getStarted'>> = ({
  navigation: {navigate},
}) => {
  const {t} = useTranslation();
  const carouselRef = useRef<ICarouselInstance>(null);
  const progressValue = useSharedValue<number>(0);
  const [statusBarStyle, setStatusBarStyle] = useState<
    'light-content' | 'dark-content'
  >('light-content');

  const items = [
    {
      image: images.intro1,
      title: t('GetStarted.title1'),
    },
    {
      image: images.intro2,
      title: t('GetStarted.title2'),
    },
    {
      image: images.intro3,
      title: t('GetStarted.title3'),
    },
    {
      image: images.intro4,
      title: t('GetStarted.title4'),
    },
  ];

  const onPressNext = () => {
    if (carouselRef.current?.getCurrentIndex() === items.length - 1) {
      navigate('auth');
    } else {
      carouselRef.current?.next();
    }
  };

  const renderItem: CarouselRenderItem<typeof items[number]> = ({
    item,
    animationValue,
    index,
  }) => {
    return (
      <CarouselItem
        animationValue={animationValue}
        image={item.image}
        title={item.title}
        index={index}
      />
    );
  };

  const animStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progressValue.value,
      [0, 1],
      [colors.primary, '#FFFFFF'],
    );

    return {
      backgroundColor,
    };
  }, [items]);

  useDerivedValue(() => {
    if (progressValue.value >= 0.8 && statusBarStyle !== 'dark-content') {
      runOnJS(setStatusBarStyle)('dark-content');
    } else if (
      progressValue.value < 0.8 &&
      statusBarStyle !== 'light-content'
    ) {
      runOnJS(setStatusBarStyle)('light-content');
    }
  }, [statusBarStyle]);

  return (
    <Animated.View style={[styles.container, animStyle]}>
      <StatusBar
        barStyle={statusBarStyle}
        animated
        backgroundColor={
          statusBarStyle === 'light-content' ? colors.primary : colors.white
        }
      />
      <SafeAreaView edges={['bottom']}>
        <View style={styles.contentContainer}>
          <Carousel
            ref={carouselRef}
            loop={false}
            data={items}
            renderItem={renderItem}
            width={variables.dimensions.width}
            height={variables.dimensions.height * 0.85}
            mode="parallax"
            modeConfig={{
              parallaxScrollingOffset: 100,
              parallaxScrollingScale: 0.82,
            }}
            vertical={false}
            onProgressChange={(_, absoluteProgress) => {
              progressValue.value = absoluteProgress;
            }}
          />
        </View>
        {/* Implemented a custom animated button because the @/Commons/Button component is not animated,
      and we cannot change its background color and text on swipe */}
        <GetStartedButton
          onPress={onPressNext}
          style={styles.buttonStyle}
          carouselProgress={progressValue}
        />
      </SafeAreaView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
  },
  buttonStyle: {
    alignSelf: 'stretch',
    marginBottom: 10,
    marginRight: 16,
    marginLeft: 16,
  },
});

export default GetStarted;
