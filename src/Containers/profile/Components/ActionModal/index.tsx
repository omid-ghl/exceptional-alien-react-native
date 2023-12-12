import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {useTranslation} from 'react-i18next';
import Modal from '@/Commons/Modal';
import {AppConfig} from '@/Config';
import {colors, SVG, typography, variables} from '@/Theme';
import {DynamicShare, showToast, useRemovePlaybookMutation} from '@/Services';
import {useDispatch} from 'react-redux';
import {setUserPlaybooks} from '@/Store/userDetails';

const ActionModal: React.FC<any> = ({actionModalRef, data}) => {
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const [shareLinkLoading, setShareLinkLoading] = useState(false);

  const onCloseModal = useCallback(
    () => actionModalRef.current.close(),
    [actionModalRef],
  );

  const onShare = useCallback(async () => {
    if (!data || shareLinkLoading) {
      return;
    }
    if (data?.web_address) {
      setShareLinkLoading(true);
      try {
        const dynamicLink = await DynamicShare.createPlaybookDynamicLink(data);
        setShareLinkLoading(false);
        if (Platform.OS === 'android') {
          Share.share({message: dynamicLink});
        } else {
          Share.share({url: dynamicLink});
        }
      } catch (error) {
        setShareLinkLoading(false);
        showToast({
          type: 'playbook',
          text: t('dynamic_link_create_error'),
        });
      }
    }
  }, [data, shareLinkLoading, t]);

  const [
    removePlaybook,
    {isSuccess: removeIsSuccess, isLoading: removing, data: updatedPlaybooks},
  ] = useRemovePlaybookMutation();

  const onRemove = () => {
    removePlaybook({
      playbook_id: data.id,
    });
  };

  useEffect(() => {
    if (updatedPlaybooks || removeIsSuccess) {
      dispatch(setUserPlaybooks(updatedPlaybooks?.data));
      onCloseModal();
      showToast({
        type: 'playbook',
        text: `${t('removed')} '${data.title}'`,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [removeIsSuccess]);

  return (
    <Modal panGestureEnabled adjustToContentHeight customRef={actionModalRef}>
      <View style={styles.wrapperStyle}>
        <Image
          style={styles.cardImage}
          source={{
            uri: `${AppConfig.IMAGE_URL}${
              data?.user?.profile_image ?? data.primary_image
            }`,
          }}
        />
        <Text style={styles.cardTitle}>{data.title}</Text>
        <Text style={styles.playbookTitle}>{t('playbook')}</Text>
        <TouchableOpacity onPress={onShare} style={styles.actionWrapperStyle}>
          {shareLinkLoading ? (
            <ActivityIndicator size="small" color="black" />
          ) : (
            <SVG.Share height={24} width={24} />
          )}
          <Text style={styles.actionTitle}>{t('share')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={removing}
          onPress={onRemove}
          style={styles.actionWrapperStyle}>
          <SVG.Close height={24} width={24} />
          <Text style={styles.actionTitle}>{t('remove')}</Text>
        </TouchableOpacity>
        {removing ? (
          <ActivityIndicator style={styles.paddingVertical20} />
        ) : (
          <TouchableOpacity
            onPress={onCloseModal}
            style={styles.closeButtonStyle}>
            <Text style={styles.actionTitle}>{t('close')}</Text>
          </TouchableOpacity>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  wrapperStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 30,
  },
  cardImage: {
    width: variables.dimensions.width * 0.2,
    height: variables.dimensions.width * 0.2,
    borderRadius: 10,
  },
  cardTitle: {
    ...typography.h2,
    width: variables.dimensions.width / 1.7,
    textAlign: 'center',
    marginTop: 16,
  },
  actionWrapperStyle: {
    width: variables.dimensions.width * 0.9,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: 14,
  },
  closeButtonStyle: {
    width: variables.dimensions.width,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: 20,
  },
  actionTitle: {
    ...typography.h4,
    textAlign: 'center',
    marginLeft: 10,
  },
  playbookTitle: {
    ...typography.caption,
    width: variables.dimensions.width / 1.7,
    textAlign: 'center',
    marginTop: 16,
    color: colors.gray100,
  },
  paddingVertical20: {paddingVertical: 20},
});

export default ActionModal;
