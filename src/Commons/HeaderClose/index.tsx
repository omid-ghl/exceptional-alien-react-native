import {SVG} from '@/Theme';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {IHeaderClose} from './IHeaderClose';

const HeaderClose: React.FC<IHeaderClose.IProps> = () => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={styles.closeContainer}
      onPress={() => navigation.goBack()}>
      <SVG.Close />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  closeContainer: {
    padding: 4,
    marginRight: 16,
  },
});

export default HeaderClose;
