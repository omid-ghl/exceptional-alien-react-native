import {StyleSheet} from 'react-native';
import colors from './Colors';
import fonts from './Fonts';

const typography = StyleSheet.create({
  display: {
    fontFamily: fonts.medium,
    color: colors.black,
    fontSize: 40,
    lineHeight: 40,
    textTransform: 'uppercase',
  },
  h1: {
    fontFamily: fonts.medium,
    color: colors.black,
    fontSize: 32,
    lineHeight: 32,
  },
  h2: {
    fontFamily: fonts.medium,
    color: colors.black,
    fontSize: 24,
    lineHeight: 26.4,
  },
  h3: {
    fontFamily: fonts.medium,
    color: colors.black,
    fontSize: 20,
    lineHeight: 22,
  },
  h4: {
    fontFamily: fonts.medium,
    color: colors.black,
    fontSize: 18,
    lineHeight: 19.8,
  },
  h5: {
    fontFamily: fonts.medium,
    color: colors.black,
    fontSize: 14,
    lineHeight: 14,
  },
  largeParagraph: {
    fontFamily: fonts.roman,
    color: colors.black,
    fontSize: 16,
    lineHeight: 24,
  },
  smallParagraph: {
    fontFamily: fonts.roman,
    color: colors.black,
    fontSize: 14,
    lineHeight: 21,
  },
  caption: {
    fontFamily: fonts.medium,
    color: colors.black,
    fontSize: 12,
    lineHeight: 12,
  },
  pullQuote: {
    fontFamily: fonts.medium,
    color: colors.primary,
    fontSize: 24,
    lineHeight: 26.4,
  },
  tag: {
    fontFamily: fonts.helveticaMonospaced,
    color: colors.black,
    fontSize: 10,
    lineHeight: 10,
    textTransform: 'uppercase',
  },
  link: {
    fontFamily: fonts.medium,
    color: colors.primary,
    fontSize: 12,
    lineHeight: 12,
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    textDecorationColor: colors.primary,
  },
  linkSecondary: {
    fontFamily: fonts.medium,
    color: colors.black,
    fontSize: 12,
    lineHeight: 12,
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    textDecorationColor: colors.black,
  },
  error: {
    fontFamily: fonts.medium,
    color: colors.errorColor,
    fontSize: 12,
    lineHeight: 12,
  },
});

export default typography;
