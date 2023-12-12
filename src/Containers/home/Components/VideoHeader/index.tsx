import React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {colors, SVG, variables} from '@/Theme';
import {IVideoHeader} from './VideoHeader';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const VideoHeader: React.FC<IVideoHeader.IProps> = ({style, onBackPress}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.headerWrapper,
        {marginTop: Math.max(insets.top, 16)},
        style,
      ]}>
      <TouchableOpacity onPress={onBackPress} style={styles.backWrapper}>
        <SVG.ChevronLeft width={20} height={20} stroke={colors.black} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    width: variables.dimensions.width,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    position: 'absolute',
    top: 0,
  },
  backWrapper: {
    width: 40,
    height: 40,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
  },
});

export default VideoHeader;
