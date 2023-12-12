import React from 'react';
import {Platform, StyleSheet, View} from 'react-native';

import {IModal} from './Modal';
import {Modalize} from 'react-native-modalize';
import {Portal} from 'react-native-portalize';
import {dimensions} from '@/Theme/Variables';

const Modal = (props: IModal.IProps) => {
  const {
    children,
    customRef,
    snapPoint,
    panGestureComponentEnabled = false,
    panGestureEnabled = false,
    withReactModal = false,
    adjustToContentHeight,
    onClose,
    onClosed,
    onOverlayPress,
    onOpen,
    onOpened,
    isFlatList,
    flatListProps,
    FooterComponent,
    scrollViewProps,
    contentStyle,
  } = props;
  return (
    <Portal>
      <Modalize
        scrollViewProps={scrollViewProps}
        handlePosition="inside"
        modalStyle={styles.modalStyle}
        handleStyle={styles.handleStyle}
        ref={customRef}
        snapPoint={snapPoint}
        adjustToContentHeight={adjustToContentHeight}
        panGestureComponentEnabled={panGestureComponentEnabled}
        panGestureEnabled={panGestureEnabled}
        withReactModal={withReactModal}
        onClose={onClose}
        onClosed={onClosed}
        onOverlayPress={onOverlayPress}
        onOpen={onOpen}
        onOpened={onOpened}
        flatListProps={flatListProps}
        FooterComponent={FooterComponent}>
        {!isFlatList && (
          <View style={[styles.marginTop30, contentStyle]}>{children}</View>
        )}
      </Modalize>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalStyle: {
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  handleStyle: {marginVertical: 8},
  marginTop30: {
    marginTop: 30,
  },
});
export default Modal;
