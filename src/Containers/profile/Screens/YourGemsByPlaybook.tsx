import React, {useEffect, useRef, useState} from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
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
import {colors, SVG, typography, variables} from '@/Theme';
import {useTranslation} from 'react-i18next';
import {dimensions} from '@/Theme/Variables';
import {useGemsByUsersPlaybookQuery} from '@/Services';
import {Gem} from '@/Models';
import {Button, GemCard} from '@/Commons';
import {TextSkeleton} from '@/Commons/Skeleton';
import {Modalize} from 'react-native-modalize';
import {AddGemsModal, YourPlaybookOptionModal} from '../Components';
import {useIsFocused} from '@react-navigation/native';
import GemActionModal from '@/Containers/home/Components/GemActionModal';
import {useAppSelector} from '@/Hooks';

const YourGemsByPlaybook: React.FC<
  StackScreenProps<StackParamList, 'yourGemsByPlaybook'>
> = ({
  navigation,
  route: {
    params: {playbook},
  },
}) => {
  const isFocused = useIsFocused();
  const myActionModalRef = useRef<Modalize>(null);
  const userGems = useAppSelector(state => state.userDetails.userGems);
  const gemActionsModalRef = useRef<Modalize>(null);
  const addGemsModalRef = useRef<Modalize>(null);
  const [selectedGem, setSelectedGem] = useState<Gem>({} as Gem);

  const {t} = useTranslation();
  const [finalGems, setFinalGems] = useState<Gem[]>([]);

  const openPlaybookModal = () => {
    myActionModalRef.current?.open();
  };

  const openGemModal = (gem: Gem) => {
    setSelectedGem(gem);
    gemActionsModalRef.current?.open();
  };

  const {
    data: userGemsByPlaybook,
    isLoading: loadingUserGemsByPlaybook,
    refetch,
  } = useGemsByUsersPlaybookQuery(
    {
      user_playbook_id: playbook?.id,
    },
    {
      skip: !playbook?.id,
    },
  );

  useEffect(() => {
    if (userGemsByPlaybook) {
      setFinalGems(userGemsByPlaybook);
    }
  }, [userGemsByPlaybook]);

  useEffect(() => {
    if (isFocused) {
      refetch();
    }
  }, [isFocused, refetch]);

  const HeaderTitle = () => (
    <View style={styles.headerWrappStyle}>
      <View>
        <Text style={styles.collectionTitle}>
          {playbook.title ?? (playbook as any)?.name}
        </Text>
        {loadingUserGemsByPlaybook ? (
          <TextSkeleton
            style={styles.collectionCounter}
            width={dimensions.width / 6}
            height={18}
            color={colors.gray10}
          />
        ) : (
          <Text style={styles.collectionCounter}>
            {t(finalGems?.length === 1 ? 'gemCount_one' : 'gemCount_other', {
              count: finalGems.length,
            })}
          </Text>
        )}
      </View>
      <TouchableOpacity onPress={openPlaybookModal} style={styles.cardBtn}>
        <Text style={styles.cardBtntxt}>...</Text>
      </TouchableOpacity>
    </View>
  );

  const renderGems = (item: {item: Gem}) => {
    const gem = item.item;
    return (
      <GemCard
        key={gem.id}
        gem={gem}
        variant="options"
        onOptionsPress={() => {
          openGemModal(gem);
        }}
        onPress={() => {
          navigation.push('gemDetails', {
            gem: gem,
            gemId: gem.id,
            myPlaybookId: playbook.id,
          });
        }}
        style={styles.gemCard}
      />
    );
  };

  const renderEmptyList = () => {
    const userHasGems = userGems.length;
    return (
      <View style={styles.emptyWrapper}>
        <SVG.Gem stroke={colors.primary} height={48} width={48} />
        <Text style={styles.emptyTitleStyle}>{t('no_gems')}</Text>
        <Text style={styles.emptySubtitleStyle}>
          {t(userHasGems ? 'empty_list_has_gems' : 'no_gems_collected_desc')}
        </Text>
        <Button
          onPress={() => {
            if (userHasGems) {
              addGemsModalRef?.current?.open();
            } else {
              navigation.reset({
                routes: [
                  {name: 'tabBar', params: {initialActiveTab: 'search'}},
                ],
              });
            }
          }}
          style={styles.createNewButton}
          title={t(userHasGems ? 'add_gems' : 'discover_gems')}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoiding}>
        <HeaderTitle />
        <View style={styles.mainWrapper}>
          <FlatList
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContentContainer}
            keyExtractor={item => JSON.stringify(item)}
            data={finalGems}
            renderItem={renderGems}
            refreshControl={
              <RefreshControl
                refreshing={loadingUserGemsByPlaybook}
                onRefresh={refetch}
              />
            }
            ListEmptyComponent={
              !loadingUserGemsByPlaybook ? renderEmptyList : null
            }
          />
        </View>
      </KeyboardAvoidingView>
      <YourPlaybookOptionModal
        createdByMe={true}
        gemsCount={finalGems?.length}
        data={playbook}
        modalRef={myActionModalRef}
        gems={finalGems}
        onAddGemsPress={() => {
          addGemsModalRef?.current?.open();
        }}
      />
      <GemActionModal
        isInMyPlaybook
        navigation={navigation}
        data={selectedGem}
        gemActionModalRef={gemActionsModalRef}
        myPlaybookId={playbook.id}
      />
      <AddGemsModal
        gems={finalGems ?? []}
        playbook_id={playbook?.id}
        playbook_name={playbook?.title ?? playbook?.name}
        ref={addGemsModalRef}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  keyboardAvoiding: {
    flex: 1,
  },
  mainWrapper: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  headerWrappStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.gray30,
  },
  collectionTitle: {
    ...typography.h1,
    width: dimensions.width * 0.75,
  },
  collectionCounter: {
    ...typography.h5,
    marginVertical: 5,
    color: colors.gray100,
  },
  cardBtn: {
    borderColor: colors.gray30,
    borderWidth: 1,
    width: 40,
    height: 40,
    alignItems: 'center',
    borderRadius: 40,
  },
  cardBtntxt: {
    fontWeight: '600',
    fontSize: 22,
    color: colors.black,
  },
  gemCard: {
    marginTop: 8,
  },
  listContentContainer: {
    paddingBottom: 16,
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

export default YourGemsByPlaybook;
