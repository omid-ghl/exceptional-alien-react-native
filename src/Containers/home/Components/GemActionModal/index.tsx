import React, {useCallback, useEffect, useRef, useState} from 'react';
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
import {
  DynamicShare,
  showToast,
  useRemoveGemFromPlaybookMutation,
  useRemoveGemMutation,
} from '@/Services';
import {useDispatch} from 'react-redux';
import {setUserGems} from '@/Store/userDetails';
import {Modalize} from 'react-native-modalize';
import PlayBooksModal from '../PlayBooksModal';
import {IGemActionModal} from './GemActionModal';

const GemActionModal: React.FC<IGemActionModal.IProps> = ({
  gemActionModalRef,
  data,
  navigation,
  removable,
  isInMyPlaybook,
  myPlaybookId,
}) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();

  const onCloseModal = useCallback(() => {
    gemActionModalRef.current?.close();
  }, [gemActionModalRef]);
  const playbookModalRef = useRef<Modalize>(null);
  const [sentRemoveRequestGemId, setSentRemoveRequestGemId] = useState<
    number | null
  >(null);
  const [shareLink, setShareLink] = useState<string>();
  const [shareLinkLoading, setShareLinkLoading] = useState(false);

  const [
    removeGem,
    {isSuccess: removeIsSuccess, isLoading: removeIsLoading, data: updatedGems},
  ] = useRemoveGemMutation();

  const [
    removeGemFromPlaybook,
    {
      isSuccess: removeFromPlaybookSuccess,
      isLoading: removeFromPlaybookIsLoading,
    },
  ] = useRemoveGemFromPlaybookMutation();

  useEffect(() => {
    if (updatedGems) {
      dispatch(setUserGems(updatedGems?.data));
      onCloseModal();
      showToast({type: 'gem', text: `${t('removed')} '${data?.name}'`});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [removeIsSuccess, updatedGems]);

  useEffect(() => {
    if (removeFromPlaybookSuccess && sentRemoveRequestGemId === data.id) {
      onCloseModal();
      showToast({type: 'gem', text: `${t('removed')} '${data?.name}'`});
    }
  }, [
    data.id,
    data?.name,
    onCloseModal,
    removeFromPlaybookSuccess,
    sentRemoveRequestGemId,
    t,
  ]);

  const onShare = useCallback(async () => {
    if (!data || shareLinkLoading) {
      return;
    }
    if (data?.web_address) {
      setShareLinkLoading(true);
      try {
        const dynamicLink =
          shareLink ?? (await DynamicShare.createGemDynamicLink(data));
        setShareLink(dynamicLink);
        setShareLinkLoading(false);
        if (Platform.OS === 'android') {
          Share.share({message: dynamicLink});
        } else {
          Share.share({url: dynamicLink});
        }
      } catch (error) {
        setShareLinkLoading(false);
        showToast({
          type: 'gem',
          text: t('dynamic_link_create_error'),
        });
      }
    }
  }, [data, shareLink, shareLinkLoading, t]);

  const onRemove = () => {
    removeGem({
      gem_id: data.id,
    });
  };

  const onRemoveFromPlaybook = () => {
    if (!myPlaybookId) {
      return;
    }
    setSentRemoveRequestGemId(data.id);
    removeGemFromPlaybook({
      user_playbook_id: myPlaybookId,
      gems: [data.id],
    });
  };

  return (
    <>
      <Modal
        panGestureEnabled
        adjustToContentHeight
        customRef={gemActionModalRef}>
        <View style={styles.wrapperStyle}>
          <Image
            style={styles.cardImage}
            source={{
              uri: `${AppConfig.IMAGE_URL}${data.portrait_feature_image}`,
            }}
          />
          <Text style={styles.cardTitle}>{data.name}</Text>
          <Text style={styles.playbookTitle}>{data.map_address}</Text>
          <TouchableOpacity onPress={onShare} style={styles.actionWrapperStyle}>
            {shareLinkLoading ? (
              <ActivityIndicator size="small" color="black" />
            ) : (
              <SVG.Share height={24} width={24} />
            )}
            <Text style={styles.actionTitle}>{t('share')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              onCloseModal();
              playbookModalRef.current?.open();
            }}
            style={styles.actionWrapperStyle}>
            <SVG.PlaybookNonColor
              stroke={colors.black}
              height={24}
              width={24}
            />
            <Text style={styles.actionTitle}>{t('addToPlaybook')}</Text>
          </TouchableOpacity>
          {isInMyPlaybook ? (
            <TouchableOpacity
              disabled={removeFromPlaybookIsLoading}
              onPress={onRemoveFromPlaybook}
              style={styles.actionWrapperStyle}>
              <SVG.Close height={24} width={24} />
              <Text style={styles.actionTitle}>
                {t('remove_from_playbook')}
              </Text>
            </TouchableOpacity>
          ) : removable ? (
            <TouchableOpacity
              disabled={removeIsLoading}
              onPress={onRemove}
              style={styles.actionWrapperStyle}>
              <SVG.Close height={24} width={24} />
              <Text style={styles.actionTitle}>
                {t('remove_from_your_collection')}
              </Text>
            </TouchableOpacity>
          ) : null}

          {removeIsLoading ? (
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
      <PlayBooksModal
        gemId={data?.id}
        navigation={navigation}
        playbookModalRef={playbookModalRef}
      />
    </>
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

export default GemActionModal;
