import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {useTranslation} from 'react-i18next';
import {colors, SVG, typography, variables} from '@/Theme';
import {IStoryHeader} from './StoryHeader';

const StoryHeader = (props: IStoryHeader.IProps) => {
  const {navigation, onRightButtonPress, rightButtonVariant = 'share'} = props;
  const {t} = useTranslation();
  const goBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.headerWrapper}>
      <TouchableOpacity onPress={goBack} style={styles.backWrapper}>
        <SVG.ChevronLeft width={20} height={20} stroke={colors.black} />
      </TouchableOpacity>
      <View style={styles.titleWrapper}>
        <SVG.Story
          style={styles.marginRight5}
          width={20}
          height={20}
          stroke={colors.black}
        />
        <Text style={styles.title}>{t('story')}</Text>
      </View>
      {rightButtonVariant !== 'none' && (
        <TouchableOpacity
          style={styles.threeDotWrapper}
          onPress={onRightButtonPress}>
          {rightButtonVariant === 'menu' ? (
            <SVG.ThreeDots width={20} height={20} stroke={colors.black} />
          ) : rightButtonVariant === 'share' ? (
            <SVG.Share width={20} height={20} stroke={colors.black} />
          ) : null}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  marginRight5: {marginRight: 5},
  headerWrapper: {
    width: variables.dimensions.width,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    // justifyContent: 'space-between',
    paddingHorizontal: 18,
  },
  backWrapper: {
    width: 40,
    height: 40,
    backgroundColor: 'white',
    position: 'absolute',
    left: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
  },
  titleWrapper: {
    backgroundColor: 'white',
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 32,
    borderRadius: 100,
    alignItems: 'center',
  },
  title: {
    ...typography.caption,
  },
  threeDotWrapper: {
    width: 40,
    height: 40,
    position: 'absolute',
    right: 18,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
  },
});

export default StoryHeader;
