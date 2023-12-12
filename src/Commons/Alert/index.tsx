/* eslint-disable @typescript-eslint/no-shadow */
// Because with same name parameters , code is most readable

import {colors, typography} from '@/Theme';
import {dimensions} from '@/Theme/Variables';
import React, {useEffect, useState} from 'react';
import {Modal, Pressable, StyleSheet, Text, View} from 'react-native';
import Button from '../Button';
import {IAlert} from './Alert';

let verifyByUser: (details: IAlert.IProps) => void = () => {};
let actionsInitialValue = {
  onSuccess: {
    title: '',
    task: () => {},
  },
  onFailure: {
    title: '',
    task: () => {},
  },
};

const AlertWrapper = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [actions, setActions] = useState(actionsInitialValue);

  const showModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const onSucessPressed = () => {
    actions.onSuccess.task();
    closeModal();
  };

  const onFailurePressed = () => {
    actions.onFailure.task();
    closeModal();
  };

  verifyByUser = ({title, description, actions}: IAlert.IProps): void => {
    if (
      title &&
      description &&
      actions &&
      actions?.onSuccess?.title &&
      actions?.onFailure?.title
    ) {
      setDescription(description);
      setTitle(title);
      setActions(actions);
      showModal();
    }
  };

  useEffect(() => {
    if (title) {
      showModal();
    } else {
      closeModal();
    }
  }, [title]);

  return (
    <Modal
      style={styles.modalWrapperStyle}
      animationType="fade"
      transparent={true}
      visible={modalVisible}>
      <Pressable
        style={styles.backgroundWrapper}
        onPress={() => setModalVisible(false)}
      />
      <View style={styles.alertWrapper}>
        <Text style={styles.titleStyle}>{title}</Text>
        <Text style={styles.subtitleStyle}>{description}</Text>
        <Button
          onPress={onSucessPressed}
          title={actions.onSuccess.title}
          style={styles.acceptButtonStyle}
        />
        <Button
          textStyle={styles.declineButtonText}
          onPress={onFailurePressed}
          title={actions.onFailure.title}
          style={styles.declineButton}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalWrapperStyle: {
    alignSelf: 'center',
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',
  },
  backgroundWrapper: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    flex: 1,
    justifyContent: 'center',
  },
  alertWrapper: {
    width: dimensions.width * 0.8,
    backgroundColor: 'white',
    alignSelf: 'center',
    position: 'absolute',
    zIndex: 1000,
    top: dimensions.height / 2.8,
    bottom: 'auto',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 30,
    paddingTop: 34,
    paddingBottom: 20,
  },
  titleStyle: {...typography.h4, textAlign: 'center'},

  subtitleStyle: {
    ...typography.caption,
    color: colors.gray100,
    textAlign: 'center',
    marginTop: 24,
  },
  acceptButtonStyle: {
    width: dimensions.width * 0.4,
    backgroundColor: 'black',
    marginTop: 24,
  },
  declineButton: {
    width: dimensions.width * 0.4,
    backgroundColor: 'white',
    marginTop: 5,
  },
  declineButtonText: {color: 'black'},
});
export {AlertWrapper, verifyByUser};
