import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {useTranslation} from 'react-i18next';
import Modal from '@/Commons/Modal';
import {colors, SVG, typography} from '@/Theme';
import {IPlayBookCollectedModal} from './PlayBookCollectedModal';
import {Button} from '@/Commons';
import Variables from '@/Theme/Variables';

const _PlayBookCollectedModal: React.FC<IPlayBookCollectedModal.IProps> = ({
  collectedModalRef,
}) => {
  const {t} = useTranslation();

  const onCloseModal = () => {
    collectedModalRef.current?.close();
  };

  return (
    <Modal adjustToContentHeight customRef={collectedModalRef}>
      <View style={styles.collectedWrapp}>
        <SVG.SuccessPlaybook
          width={Variables.dimensions.width * 0.15}
          height={Variables.dimensions.width * 0.15}
        />
        <Text style={styles.collcetedStyle}>{t('collected_playbook')}</Text>
        <Text style={styles.subtitleText}>{t('saved_playbook')}</Text>
        <Button
          style={styles.marginTop80}
          title={t('done')}
          onPress={onCloseModal}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  collectedWrapp: {
    marginHorizontal: 17,
    flex: 1,
    marginVertical: 40,
  },
  collcetedStyle: {
    ...typography.h1,
    width: Variables.dimensions.width * 0.5,
    marginTop: 20,
  },
  subtitleText: {
    ...typography.h4,
    color: colors.gray100,
    marginTop: 10,
  },
  marginTop80: {marginTop: 70},
});

export const PlayBookCollectedModal = React.memo(_PlayBookCollectedModal);
