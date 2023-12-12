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
import {Gem} from '@/Models';
import {useTranslation} from 'react-i18next';
import GemActionModal from '@/Containers/home/Components/GemActionModal';
import {Modalize} from 'react-native-modalize';
import {useAppSelector} from '@/Hooks';
import {Button} from '@/Commons';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {StackParamList} from '@/Navigators/Stacks';

const ProfileGem: React.FC<any> = () => {
  const {t} = useTranslation();
  const actionModalRef = useRef<Modalize>(null);
  const userGems = useAppSelector(state => state.userDetails.userGems);

  const [choosedGem, setChoosedGem] = useState<Gem>({});

  const navigation =
    useNavigation<StackNavigationProp<StackParamList, 'gemDetails'>>();

  const renderItemGems: ListRenderItem<Gem> = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('gemDetails', {gemId: item.id, gem: item})
        }
        activeOpacity={0.7}
        style={styles.cardContainer}>
        <View style={styles.cardDetail}>
          <Image
            style={styles.cardImage}
            source={{uri: `${AppConfig.IMAGE_URL}${item.feature_image}`}}
          />
          <View style={styles.cardTxtContainer}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardRole}>{item.location?.name}</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            actionModalRef.current?.open();
            setChoosedGem(item);
          }}
          style={styles.cardBtn}>
          <Text style={styles.cardBtntxt}>...</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderEmptyList = () => (
    <View style={styles.emptyWrapper}>
      <SVG.Gem stroke={colors.primary} height={48} width={48} />
      <Text style={styles.emptyTitleStyle}>{t('no_gems')}</Text>
      <Text style={styles.emptySubtitleStyle}>
        {t('no_gems_collected_desc')}
      </Text>
      <Button
        onPress={() => {
          navigation.reset({
            routes: [
              {
                name: 'tabBar',
                params: {initialActiveTab: 'search', openTabName: 'Gems'},
              },
            ],
          });
        }}
        style={styles.createNewButton}
        title={t('discover_gems')}
      />
    </View>
  );

  return (
    <>
      <View style={styles.mainWrapper}>
        <View style={styles.collectionWrapper}>
          <Text style={styles.collectionTitle}>{t('your_collection')}</Text>
          {userGems && userGems?.length > 0 && (
            <Text style={styles.collectionCounter}>
              {t(userGems?.length === 1 ? 'gemCount_one' : 'gemCount_other', {
                count: userGems?.length,
              })}
            </Text>
          )}
          <FlatList
            ListEmptyComponent={renderEmptyList}
            data={userGems}
            keyExtractor={item => item.id.toString()}
            renderItem={renderItemGems}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
      <GemActionModal
        removable
        navigation={navigation}
        data={choosedGem}
        gemActionModalRef={actionModalRef}
      />
    </>
  );
};

const styles = StyleSheet.create({
  mainWrapper: {
    paddingHorizontal: 20,
    flex: 1,
    backgroundColor: colors.white,
  },
  createBtn: {
    borderColor: colors.primary,
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 15,
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
});

export default ProfileGem;
