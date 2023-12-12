import React, {useEffect} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
  ListRenderItem,
  Platform,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {StackScreenProps} from '@react-navigation/stack';
import {StackParamList} from '@/Navigators/Stacks';
import {useAppSelector} from '@/Hooks';
import {ProfilePlaybooksHeader} from '../Components';
import {colors, SVG, typography, variables} from '@/Theme';
import {StorybookList} from '@/Models/Responses/StorybookList';
import {useTranslation} from 'react-i18next';
import {Button} from '@/Commons';
import {useDispatch} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import {useLazyGetPlaybooksCreatedByUserQuery} from '@/Services/modules/playbooks';
import {setCreatedUserPlaybooks} from '@/Store/userDetails';
import LinearGradient from 'react-native-linear-gradient';
import {AppConfig} from '@/Config';
import {loginIntrupt} from '@/Utils';

const YourPlaybooks: React.FC<
  StackScreenProps<StackParamList, 'yourPlaybooks'>
> = ({navigation}) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const guestMode = useAppSelector(state => state.auth.guest.guestMode);

  const isFocused = useIsFocused();

  const userPlaybooks = useAppSelector(
    state => state.userDetails.createdPlaybooks,
  );

  const [
    getCreatedPlaybooksByUser,
    {
      data: createdPlaybooks,
      isLoading: loadingCreatedPlaybooks,
      isFetching: fetchingCreatedPlaybooks,
    },
  ] = useLazyGetPlaybooksCreatedByUserQuery();

  useEffect(() => {
    if (!guestMode) {
      getCreatedPlaybooksByUser({});
    }
  }, [getCreatedPlaybooksByUser, guestMode, isFocused]);

  useEffect(() => {
    if (!guestMode) {
      dispatch(setCreatedUserPlaybooks(createdPlaybooks));
    }
  }, [createdPlaybooks, dispatch, guestMode]);

  const renderItemPlaybooks: ListRenderItem<StorybookList> = ({
    item,
  }: {
    item: StorybookList;
  }) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('yourGemsByPlaybook', {
            playbook: item,
            createdByMe: true,
          })
        }
        style={styles.cardContainer}>
        <View style={styles.cardDetail}>
          {item?.gems?.[0]?.feature_image ? (
            <Image
              style={styles.cardImage}
              source={{
                uri: `${AppConfig.IMAGE_URL}${item.gems[0].feature_image}`,
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
              {t(item?.gems?.length === 1 ? 'gemCount_one' : 'gemCount_other', {
                count: item?.gems?.length,
              })}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyList = () => {
    const stillLoading = loadingCreatedPlaybooks || fetchingCreatedPlaybooks;
    return (
      <View style={styles.emptyWrapper}>
        {stillLoading ? (
          <ActivityIndicator />
        ) : (
          <>
            <SVG.PlaybookNonColor
              stroke={colors.primary}
              height={48}
              width={48}
            />
            <Text style={styles.emptyTitleStyle}>{t('no_playbooks')}</Text>
            <Text style={styles.emptySubtitleStyle}>
              {t('empty_playbooks_subtitle')}
            </Text>
            <Button
              onPress={() => {
                if (guestMode) {
                  return loginIntrupt();
                }
                navigation.navigate('createPlaybook', {playbook: null});
              }}
              style={styles.createNewButton}
              title={t('create_playbook')}
            />
          </>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoiding}>
        <ProfilePlaybooksHeader isYourCollection />
        <View style={styles.mainWrapper}>
          <View style={styles.collectionWrapper}>
            <Text style={styles.collectionTitle}>{t('my_playbooks')}</Text>
            {userPlaybooks && userPlaybooks?.length > 0 && (
              <Text style={styles.collectionCounter}>
                {t(
                  userPlaybooks?.length === 1
                    ? 'playbookCount_one'
                    : 'playbookCount_other',
                  {count: userPlaybooks?.length},
                )}
              </Text>
            )}

            <FlatList
              refreshControl={
                <RefreshControl
                  onRefresh={() => {
                    if (!guestMode) {
                      getCreatedPlaybooksByUser({});
                    }
                  }}
                  refreshing={
                    loadingCreatedPlaybooks || fetchingCreatedPlaybooks
                  }
                />
              }
              data={userPlaybooks}
              keyExtractor={item => item.id.toString()}
              renderItem={renderItemPlaybooks}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={renderEmptyList}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  tabBar: {
    marginTop: 60,
  },
  keyboardAvoiding: {
    flex: 1,
  },
  mainWrapper: {
    paddingHorizontal: 20,
    flex: 1,
    backgroundColor: colors.white,
  },
  collectionWrapper: {
    flex: 1,
  },
  collectionTitle: {
    ...typography.h2,
  },
  collectionCounter: {
    ...typography.h5,
    marginBottom: 20,
  },
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  cardDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardImage: {
    width: variables.dimensions.width * 0.18,
    height: variables.dimensions.width * 0.18,
    borderRadius: 10,
    marginRight: 15,
  },
  cardBtn: {
    borderColor: colors.gray30,
    borderWidth: 1,
    width: 30,
    height: 30,
    alignItems: 'center',
    borderRadius: 40,
  },
  cardTxtContainer: {width: variables.dimensions.width * 0.5},
  cardTitle: {
    ...typography.h4,
  },
  cardRole: {
    ...typography.caption,
    color: colors.gray100,
    marginTop: 5,
  },
  emptyWrapper: {
    alignSelf: 'center',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    height: variables.dimensions.height / 2,
  },
  emptyTitleStyle: {
    ...typography.h4,
    alignSelf: 'center',
    marginTop: 20,
  },
  emptySubtitleStyle: {
    ...typography.caption,
    width: variables.dimensions.width / 1.5,
    color: colors.gray100,
    textAlign: 'center',
    marginTop: 14,
    alignSelf: 'center',
  },
  emptyButtonStyle: {
    marginTop: 24,
    width: variables.dimensions.width / 1.5,
    alignSelf: 'center',
  },
  createNewButton: {paddingHorizontal: 32, marginTop: 24},

  cardBtntxt: {
    fontWeight: '600',
    fontSize: 16,
    color: colors.black,
  },

  playbooksWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 0.2,
    marginHorizontal: 16,
  },
  linearStyle: {
    width: variables.dimensions.width * 0.18,
    height: variables.dimensions.width * 0.18,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginRight: 15,
  },
  playbooksBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  playbooksTitle: {
    ...typography.h4,
  },
  playbooksCounter: {
    ...typography.caption,
    color: colors.gray100,
  },
});

export default YourPlaybooks;
