import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {useTranslation} from 'react-i18next';
import Modal from '@/Commons/Modal';
import {colors, SVG, typography} from '@/Theme';
import {IGemCollectedModal} from './GemCollectedModal';
import {Button} from '@/Commons';
import Variables from '@/Theme/Variables';

const GemCollectedTray: React.FC<IGemCollectedModal.IProps> = ({
  collectGemModalRef,
  playbookModalRef,
}) => {
  const {t} = useTranslation();

  return (
    <Modal
      withReactModal={false}
      panGestureEnabled
      adjustToContentHeight
      customRef={collectGemModalRef}>
      <View style={styles.collectedWrapp}>
        <SVG.CollectedGem
          width={Variables.dimensions.width * 0.15}
          height={Variables.dimensions.width * 0.15}
        />
        <Text style={styles.collcetedStyle}>{t('collected_gem')}</Text>
        <Text style={styles.subtitleText}>{t('saved_gem')}</Text>
        <Button
          style={styles.marginTop80}
          title={t('addToPlaybook')}
          onPress={() => {
            collectGemModalRef.current?.close();
            playbookModalRef.current?.open();
          }}
        />
        <Button
          textStyle={{color: colors.black}}
          style={{backgroundColor: colors.white}}
          title={t('close')}
          onPress={() => {
            collectGemModalRef.current?.close();
          }}
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
    width: Variables.dimensions.width / 1.5,
    marginTop: 20,
  },
  subtitleText: {
    ...typography.h4,
    color: colors.gray100,
    marginTop: 10,
  },
  gemCategoryWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  marginTop80: {marginTop: 70},
});

export const GemCollectedModal = React.memo(GemCollectedTray);
