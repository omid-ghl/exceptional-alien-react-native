import React, {useCallback, useEffect} from 'react';
import {
  ActivityIndicator,
  Image,
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
  showToast,
  useRemoveFromUserPlaybookMutation,
  useRemovePlaybookMutation,
} from '@/Services';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {StackParamList} from '@/Navigators/Stacks';
import {verifyByUser} from '@/Commons/Alert';
import LinearGradient from 'react-native-linear-gradient';
import {useDispatch} from 'react-redux';
import {setCreatedUserPlaybooks, setUserPlaybooks} from '@/Store/userDetails';
import {useAppSelector} from '@/Hooks';

const YourPlaybookOptionModal: React.FC<any> = ({
  modalRef,
  data,
  gemsCount,
  gems,
  createdByMe = false,
  onAddGemsPress = () => {},
}) => {
  const {t} = useTranslation();
  const userGems = useAppSelector(state => state.userDetails.userGems);
  const dispatch = useDispatch();
  const navigation =
    useNavigation<NavigationProp<StackParamList, 'yourGemsByPlaybook'>>();

  const onCloseModal = () => modalRef.current.close();
  const onChangeName = () => {
    modalRef.current.close();
    navigation.navigate('createPlaybook', {playbook: data, editTitle: true});
  };

  const [
    removePlaybook,
    {
      isSuccess: removeIsSuccess,
      isLoading: removeIsLoading,
      data: updatedPlaybooks,
    },
  ] = useRemovePlaybookMutation();

  const [
    removeUserPlaybook,
    {
      isSuccess: removeUserPlaybookIsSuccess,
      isLoading: removeUserPlaybookIsLoading,
      data: updatedUserPlaybooks,
    },
  ] = useRemoveFromUserPlaybookMutation();

  const onRemove = () => {
    verifyByUser({
      title: t('delete_playbook_alert'),
      description: t('delete_playbook_alert_desc', {
        playbookName: data.title ?? data.name,
      }),
      actions: {
        onSuccess: {
          title: t('delete'),
          task: () => {
            if (createdByMe) {
              removeUserPlaybook({
                user_playbook_id: data.id,
              });
            } else {
              removePlaybook({
                playbook_id: data.id,
              });
            }
          },
        },
        onFailure: {
          title: t('cancel'),
          task: () => {},
        },
      },
    });
  };

  useEffect(() => {
    if (updatedPlaybooks || removeUserPlaybookIsSuccess) {
      if (updatedPlaybooks) {
        dispatch(setUserPlaybooks(updatedPlaybooks?.data));
      }
      if (updatedUserPlaybooks) {
        dispatch(setCreatedUserPlaybooks(updatedUserPlaybooks?.data));
      }
      onCloseModal();
      showToast({
        type: 'playbook',
        text: `${t('deleted')} '${data.title ?? data.name}'`,
      });
      navigation.goBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [removeIsSuccess, updatedPlaybooks, removeUserPlaybookIsSuccess]);

  const addNewGems = () => {
    modalRef.current.close();
    if (userGems.length) {
      onAddGemsPress();
    }
  };

  const allCollected = useCallback(() => {
    const freshUserGems = userGems.map(i => i.id);
    const freshGems = gems.map(i => i.id);
    const difference = freshUserGems.filter(x => !freshGems.includes(x));
    return !difference.length;
  }, [userGems, gems]);

  return (
    <Modal panGestureEnabled adjustToContentHeight customRef={modalRef}>
      <View style={styles.wrapperStyle}>
        {data.primary_image ? (
          <Image
            style={styles.cardImage}
            source={{uri: `${AppConfig.IMAGE_URL}${data.primary_image}`}}
          />
        ) : (
          <LinearGradient
            start={{x: 0.4, y: 0.2}}
            end={{x: 0.8, y: 1}}
            colors={['#2b34c2', '#ABCDFF']}
            style={styles.linearStyle}>
            <SVG.Playbooks
              stroke={colors.white}
              width={variables.dimensions.width * 0.1}
              height={variables.dimensions.width * 0.1}
            />
          </LinearGradient>
        )}

        <Text style={styles.cardTitle}>{data.title ?? data.name}</Text>
        <Text style={styles.gemsCountStyle}>
          {t(gemsCount === 1 ? 'gemCount_one' : 'gemCount_other', {
            count: gemsCount,
          })}
        </Text>
        <TouchableOpacity
          onPress={onChangeName}
          style={styles.actionWrapperStyle}>
          <SVG.Edit height={24} width={24} />
          <Text style={styles.actionTitle}>{t('edit_playbook')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={
            removeIsLoading || removeUserPlaybookIsLoading || allCollected()
          }
          onPress={addNewGems}
          style={styles.actionWrapperStyle}>
          <SVG.Gem
            stroke={allCollected() ? colors.gray50 : colors.black}
            height={24}
            width={24}
          />
          <Text
            style={[
              styles.actionTitle,
              {color: allCollected() ? colors.gray50 : colors.black},
            ]}>
            {t('add_gems')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={removeIsLoading || removeUserPlaybookIsLoading}
          onPress={onRemove}
          style={styles.actionWrapperStyle}>
          <SVG.Close height={24} width={24} />
          <Text style={styles.actionTitle}>
            {/* {createdByMe ? t('delete') : t('remove')} */}
            {t('delete')}
          </Text>
        </TouchableOpacity>
        {removeIsLoading || removeUserPlaybookIsLoading ? (
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
    width: variables.dimensions.width * 0.18,
    height: variables.dimensions.width * 0.18,
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
  gemsCountStyle: {
    ...typography.caption,
    width: variables.dimensions.width / 1.7,
    textAlign: 'center',
    marginTop: 8,
    color: colors.gray100,
  },
  linearStyle: {
    width: variables.dimensions.width * 0.18,
    height: variables.dimensions.width * 0.18,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  paddingVertical20: {paddingVertical: 20},
});

export default YourPlaybookOptionModal;
