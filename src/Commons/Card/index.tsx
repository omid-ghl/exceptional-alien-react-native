import React from 'react';
import {TouchableOpacity, StyleSheet, Image, View, Text} from 'react-native';

import {colors, SVG, typography, variables} from '@/Theme';
import {AppConfig} from '@/Config';
import LinearGradient from 'react-native-linear-gradient';
import {ICard} from './Card';
import FastImage from 'react-native-fast-image';
import {GEM_CATEGORIES} from '@/constants/gemCategories';
import {SvgProps, SvgUri} from 'react-native-svg';

const Card = (props: ICard.IProps) => {
  const {
    isSkeleton,
    onPress,
    style,
    cardName,
    backImage,
    logoImage,
    logoTitle,
    titleText,
    caption,
    size = 'large',
    variant = 'normal',
    showLogo,
    logoImageStyle,
    logoTitleStyle,
    categoryId,
    isSelected,
    onOptionsPress,
  } = props;
  if (isSkeleton) {
    return (
      <View
        style={[styles.wrapper, size === 'small' && styles.smallWidth, style]}>
        <View
          style={[styles.skeleton, size === 'small' && styles.smallWidth]}
        />
      </View>
    );
  }

  const cardNames = !cardName
    ? []
    : typeof cardName === 'string'
    ? [cardName]
    : [...cardName];

  const CategoriesIconComp: React.FC<SvgProps> | null =
    categoryId && categoryId >= 1 && categoryId <= GEM_CATEGORIES.length
      ? GEM_CATEGORIES[categoryId - 1].clean
      : null;

  return (
    <View
      style={[styles.wrapper, size === 'small' && styles.smallWidth, style]}>
      <FastImage
        source={{
          uri: `${AppConfig.IMAGE_URL}${backImage}`,
        }}
        style={[styles.backImage, size === 'small' && styles.smallWidth]}
      />
      {/* <Image source={images.filter} style={styles.filterImage} /> */}
      <LinearGradient
        colors={['#000000FF', '#00000000', '#000000FF']}
        style={[styles.gradient, size === 'small' && styles.smallWidth]}
      />
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        style={[styles.container, size === 'small' && styles.smallWidth]}>
        <View style={styles.topContent}>
          <View style={styles.logoContainer}>
            {showLogo && (
              <>
                {logoImage ? (
                  logoImage?.includes('.svg') ? (
                    <SvgUri
                      width="28"
                      height="28"
                      uri={`${AppConfig.IMAGE_URL}${logoImage}`}
                    />
                  ) : (
                    <Image
                      source={{uri: `${AppConfig.IMAGE_URL}${logoImage}`}}
                      style={[styles.logoImage, logoImageStyle]}
                    />
                  )
                ) : categoryId ? (
                  CategoriesIconComp && (
                    <CategoriesIconComp height={32} width={32} />
                  )
                ) : (
                  <SVG.FoodAndDrink style={styles.logoImage} />
                )}
                {size === 'large' && (
                  <Text style={[styles.logoTitle, logoTitleStyle]}>
                    {logoTitle}
                  </Text>
                )}
              </>
            )}
          </View>

          <View style={styles.topRightComponentWrapper}>
            <View style={styles.cardNameContainer}>
              {cardNames.map((value, i) => (
                <View
                  style={[styles.cardName, i === 0 && styles.firstCardName]}
                  key={i}>
                  <Text style={styles.cardNameText}>{value}</Text>
                </View>
              ))}
            </View>
            {variant === 'checkbox' ? (
              <View style={styles.checkBoxWrapper}>
                {isSelected && <SVG.CircleCheckFill />}
              </View>
            ) : variant === 'options' ? (
              <TouchableOpacity
                hitSlop={styles.hitSlopStyle}
                style={[styles.optionsWrapper]}
                onPress={onOptionsPress}
                activeOpacity={0.7}>
                <SVG.ThreeDotsWhite />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
        <View>
          <Text style={size === 'small' ? styles.smallTitle : styles.title}>
            {titleText}
          </Text>
          <Text
            style={size === 'small' ? styles.smallLocation : styles.location}>
            {caption}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: variables.dimensions.width - 40,
    height: variables.dimensions.width * 0.6,
    alignItems: 'center',
  },
  smallWidth: {
    width: 160,
  },
  topRightComponentWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  skeleton: {
    width: variables.dimensions.width - 40,
    height: variables.dimensions.width * 0.6,
    borderRadius: 9,
    backgroundColor: colors.gray10,
  },
  backImage: {
    width: variables.dimensions.width - 40,
    height: variables.dimensions.width * 0.6,
    borderRadius: 9,
  },
  container: {
    width: variables.dimensions.width - 40,
    height: variables.dimensions.width * 0.6,
    borderRadius: 9,
    position: 'absolute',
    justifyContent: 'space-between',
  },
  topContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 14,
    marginRight: 16,
    marginLeft: 14,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    width: 32,
    height: 32,
  },
  logoTitle: {
    ...typography.tag,
    color: colors.white,
    marginHorizontal: 4,
  },
  firstCardName: {
    backgroundColor: colors.light2,
    borderRadius: 30,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginTop: 0,
  },
  cardName: {
    backgroundColor: colors.light2,
    borderRadius: 30,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginTop: 4,
  },
  cardNameText: {
    ...typography.caption,
    color: colors.white,
  },
  cardNameContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  title: {
    ...typography.h2,
    color: colors.white,
    marginHorizontal: 16,
  },
  smallTitle: {
    ...typography.h4,
    color: colors.white,
    marginHorizontal: 12,
  },
  location: {
    ...typography.smallParagraph,
    color: colors.white,
    marginTop: 4,
    marginBottom: 12,
    marginHorizontal: 16,
  },
  smallLocation: {
    ...typography.smallParagraph,
    color: colors.white,
    marginTop: 4,
    marginBottom: 8.5,
    marginHorizontal: 12,
  },
  gradient: {
    width: variables.dimensions.width - 40,
    height: '100%',
    borderRadius: 9,
    position: 'absolute',
    opacity: 0.5,
  },
  checkBoxWrapper: {
    width: 26,
    height: 26,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: colors.white,
    marginLeft: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  optionsWrapper: {
    width: 26,
    height: 26,
    borderRadius: 26 / 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  hitSlopStyle: {
    top: 20,
    bottom: 30,
    left: 30,
    right: 20,
  },
});

export default Card;
