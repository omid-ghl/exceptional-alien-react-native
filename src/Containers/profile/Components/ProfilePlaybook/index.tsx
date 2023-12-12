import React, {useRef, useState} from 'react';
import {
  FlatList,
  Image,
  ListRenderItem,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {AppConfig} from '@/Config';
import {colors, SVG, typography, variables} from '@/Theme';
import {useTranslation} from 'react-i18next';
import {Button} from '@/Commons';
import ActionModal from '../ActionModal';
import {Modalize} from 'react-native-modalize';
import {useAppSelector} from '@/Hooks';
import {PlayBook} from '@/Models';

const ProfilePlaybook: React.FC<any> = ({navigation}) => {
  const {t} = useTranslation();

  const actionModalRef = useRef<Modalize>(null);
  const [openedPlaybook, setOpenedPlaybook] = useState({});

  const userPlaybooks = useAppSelector(
    state => state.userDetails.userPlaybooks,
  );

  const renderItemPlaybooks: ListRenderItem<PlayBook> = ({
    item,
  }: {
    item: PlayBook;
  }) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('playBookDetails', {
            playBookId: item.id,
            playBook: item,
          })
        }
        style={styles.cardContainer}>
        <View style={styles.cardDetail}>
          <Image
            style={styles.cardImage}
            source={{
              uri: `${AppConfig.IMAGE_URL}${
                item?.user?.profile_image ?? item?.primary_image
              }`,
            }}
          />
          <View style={styles.cardTxtContainer}>
            <Text style={styles.cardTitle}>{item?.title}</Text>
            <Text style={styles.cardRole}>{item.location?.name}</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            setOpenedPlaybook(item);
            actionModalRef.current?.open();
          }}
          style={styles.cardBtn}>
          <Text style={styles.cardBtntxt}>...</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderEmptyList = () => (
    <View style={styles.emptyWrapper}>
      <SVG.Playbooks stroke={colors.primary} height={48} width={48} />
      <Text style={styles.emptyTitleStyle}>{t('emptyPlaybook')}</Text>
      <Text style={styles.emptySubtitleStyle}>{t('empty_sub_title')}</Text>
      <Button
        style={styles.emptyButtonStyle}
        title={t('button_title')}
        type={'primary'}
        onPress={() => {
          navigation.reset({
            routes: [
              {
                name: 'tabBar',
                params: {
                  initialActiveTab: 'search',
                  openTabName: 'Playbooks',
                },
              },
            ],
          });
        }}
      />
    </View>
  );

  return (
    <>
      <View style={styles.mainWrapper}>
        <View style={styles.collectionWrapper}>
          <Text style={styles.collectionTitle}>{t('your_collection')}</Text>
          {userPlaybooks && userPlaybooks?.length > 0 && (
            <Text style={styles.collectionCounter}>
              {t(
                userPlaybooks?.length === 1
                  ? 'playbookCount_one'
                  : 'playbookCount_other',
                {
                  count: userPlaybooks?.length,
                },
              )}
            </Text>
          )}

          <FlatList
            data={userPlaybooks}
            keyExtractor={item => item.id.toString()}
            renderItem={renderItemPlaybooks}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={renderEmptyList}
          />
        </View>
      </View>
      <ActionModal data={openedPlaybook} actionModalRef={actionModalRef} />
    </>
  );
};

const styles = StyleSheet.create({
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
  cardDetail: {flexDirection: 'row', alignItems: 'center'},
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
  cardBtntxt: {
    fontWeight: '600',
    fontSize: 16,
    color: colors.black,
  },
  cardTxtContainer: {width: variables.dimensions.width * 0.5},
  cardTitle: {
    ...typography.h4,
  },
  cardRole: {
    ...typography.caption,
    color: colors.gray100,
  },
  emptyWrapper: {
    alignSelf: 'center',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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

export default ProfilePlaybook;
