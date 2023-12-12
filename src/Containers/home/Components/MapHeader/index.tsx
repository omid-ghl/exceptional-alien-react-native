import React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {colors, SVG, variables} from '@/Theme';
import {IMapHeader} from './MapHeader';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {StackParamList} from '@/Navigators/Stacks';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const MapHeader: React.FC<IMapHeader.IProps> = ({style}) => {
  const navigation =
    useNavigation<StackNavigationProp<StackParamList, 'mapView'>>();
  const goBack = () => {
    navigation.goBack();
  };
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.headerWrapper,
        {marginTop: Math.max(insets.top, 16)},
        style,
      ]}>
      <TouchableOpacity onPress={goBack} style={styles.backWrapper}>
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

export default MapHeader;
