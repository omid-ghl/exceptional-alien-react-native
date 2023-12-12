import React, {RefObject, useEffect, useRef} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ListRenderItem,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Modal from '@/Commons/Modal';
import {AppConfig} from '@/Config';
import {colors, SVG, typography, variables} from '@/Theme';
import {useTranslation} from 'react-i18next';
import {useAppSelector} from '@/Hooks';
import {PlayBook} from '@/Models/PlayBook';
import {showToast, useAddGemToPlaybookMutation} from '@/Services';
import Variables, {dimensions} from '@/Theme/Variables';
import LinearGradient from 'react-native-linear-gradient';
import {useLazyGetPlaybooksCreatedByUserQuery} from '@/Services/modules/playbooks';
import {useDispatch} from 'react-redux';
import {setCreatedUserPlaybooks} from '@/Store/userDetails';

const PlayBooksModal = ({
  playbookModalRef,
  navigation,
  gemId,
}: {
  playbookModalRef: RefObject<any>;
  navigation: any;
  gemId: number;
}) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();

  const selectedPlaybookRef: any = useRef();
  const modalHeightRef: any = useRef();

  const userPlaybooks = useAppSelector(
    state => state.userDetails.createdPlaybooks,
  );

  const [
    getCreatedPlaybooksByUser,
    {
      data: createdPlaybooks,
      isLoading: updatingPlaybooks,
      isSuccess: updatedPlaybooks,
    },
  ] = useLazyGetPlaybooksCreatedByUserQuery();

  const createNewPlaybook = () => {
    playbookModalRef.current.close();
    navigation.navigate('createPlaybook', {
      playbook: null,
      initialGemsIds: [gemId],
    });
  };
  const [addGemsToPlaybook, {isSuccess, isLoading, data}] =
    useAddGemToPlaybookMutation();

  const handleSubmit = ({user_playbook_id}: {user_playbook_id: number}) => {
    addGemsToPlaybook({
      user_playbook_id,
      gems: [gemId],
    });
  };

  useEffect(() => {
    if (createdPlaybooks && updatedPlaybooks) {
      (async () => {
        await dispatch(setCreatedUserPlaybooks(createdPlaybooks));
      })();
      showToast({
        type: 'gem',
        text: t('new_gems_added_toast', {
          playbookName: selectedPlaybookRef.current,
        }),
      });
      playbookModalRef.current.close();
    }
  }, [createdPlaybooks, dispatch, playbookModalRef, t, updatedPlaybooks]);

  useEffect(() => {
    if (isSuccess) {
      getCreatedPlaybooksByUser({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, playbookModalRef]);

  const renderItemPlaybooks: ListRenderItem<PlayBook> = ({item}) => (
    <TouchableOpacity
      onPress={() => {
        selectedPlaybookRef.current = item.name;
        handleSubmit({user_playbook_id: item.id});
      }}
      activeOpacity={0.5}
      style={styles.cardContainer}>
      <View style={styles.cardDetail}>
        {item.gems?.[0]?.feature_image ? (
          <Image
            style={styles.cardImage}
            source={{
              uri: `${AppConfig.IMAGE_URL}${item.gems?.[0]?.feature_image}`,
            }}
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

        <View style={styles.cardTxtContainer}>
          <Text style={styles.cardTitle}>{item?.name}</Text>
          <Text style={styles.cardRole}>
            {t(item.gems?.length === 1 ? 'gemCount_one' : 'gemCount_other', {
              count: item.gems?.length,
            })}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal
      // scrollViewProps={{scrollEnabled: false}}
      contentStyle={
        Platform.OS === 'ios' && {maxHeight: Variables.dimensions.height * 0.9}
      }
      adjustToContentHeight
      panGestureEnabled={true}
      withReactModal={true}
      panGestureComponentEnabled={true}
      customRef={playbookModalRef}>
      {(isLoading || updatingPlaybooks) && (
        <View
          style={[
            styles.loadingWrapper,
            {height: modalHeightRef.current + 30},
          ]}>
          <ActivityIndicator color={colors.white} size={'large'} />
        </View>
      )}
      <View
        onLayout={event => {
          const {height} = event.nativeEvent.layout;
          modalHeightRef.current = height;
        }}>
        <View style={styles.headerTextStyle}>
          <Text style={styles.headerText}>{t('your_Playbooks')}</Text>
        </View>
        <FlatList
          style={[
            styles.flatListWrapper,
            Platform.OS === 'ios' && {flexGrow: 0.9},
          ]}
          contentContainerStyle={{}}
          data={userPlaybooks}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItemPlaybooks}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={() => (
            <TouchableOpacity
              onPress={createNewPlaybook}
              style={styles.newPlayBookWrapper}>
              <View style={[styles.cardImage, styles.newIconWrapper]}>
                <SVG.Plus />
              </View>
              <Text style={[styles.cardTitle, styles.alignSelfCenter]}>
                {t('create_new_playbook')}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  loadingWrapper: {
    backgroundColor: 'rgba(52, 52, 52, 0.4)',
    position: 'absolute',
    zIndex: 100,
    width: dimensions.width,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -30,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  flatListWrapper: {
    width: variables.dimensions.width * 0.9,
    alignSelf: 'center',
    paddingBottom: 15,
  },
  alignSelfCenter: {alignSelf: 'center'},
  newIconWrapper: {borderWidth: 1, borderColor: colors.gray30},
  newPlayBookWrapper: {
    flexDirection: 'row',
    width: variables.dimensions.width * 0.9,
    alignSelf: 'center',
    marginVertical: 10,
  },
  headerText: {
    ...typography.h4,
    alignSelf: 'center',
  },
  headerTextStyle: {
    height: 50,
    justifyContent: 'center',
    borderBottomColor: colors.gray30,
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cardDetail: {flexDirection: 'row', alignItems: 'center'},
  cardImage: {
    width: variables.dimensions.width * 0.2,
    height: variables.dimensions.width * 0.2,
    borderRadius: 10,
    marginRight: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBtn: {
    borderColor: colors.gray30,
    borderWidth: 1,
    width: 30,
    height: 30,
    alignItems: 'center',
    borderRadius: 40,
  },
  cardTxtContainer: {
    width: variables.dimensions.width * 0.6,
  },
  cardTitle: {
    ...typography.h4,
  },
  cardRole: {
    ...typography.caption,
    color: colors.gray100,
    marginTop: 5,
  },
  linearStyle: {
    width: variables.dimensions.width * 0.18,
    height: variables.dimensions.width * 0.18,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginRight: 15,
  },
});

export default PlayBooksModal;
