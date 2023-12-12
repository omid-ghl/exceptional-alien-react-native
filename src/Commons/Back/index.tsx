import {SVG} from '@/Theme';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {IBack} from './Back';

const Back: React.FC<IBack.IProps> = () => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => navigation.goBack()}
      style={styles.backContainer}>
      <SVG.Back width={20} height={20} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backContainer: {
    padding: 3,
  },
});

export default Back;
