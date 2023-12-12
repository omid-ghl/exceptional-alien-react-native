import React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {colors, SVG, variables} from '@/Theme';
import {IPartnershipHeader} from './PartnershipHeader';

const PartnershipHeader = (props: IPartnershipHeader.IProps) => {
  const {navigation, onRightButtonPress, rightButtonVariant} = props;
  const goBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.headerWrapper}>
      <TouchableOpacity onPress={goBack} style={styles.backWrapper}>
        <SVG.ChevronLeft width={20} height={20} stroke={colors.black} />
      </TouchableOpacity>
      {rightButtonVariant !== 'none' && (
        <TouchableOpacity
          style={styles.threeDotWrapper}
          onPress={onRightButtonPress}>
          <SVG.Share width={20} height={20} stroke={colors.black} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    width: variables.dimensions.width,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
  },
  backWrapper: {
    width: 40,
    height: 40,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
  },
  threeDotWrapper: {
    width: 40,
    height: 40,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
  },
});

export default PartnershipHeader;
