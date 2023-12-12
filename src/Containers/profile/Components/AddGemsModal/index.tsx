import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors, typography, variables} from '@/Theme';
import {useTranslation} from 'react-i18next';
import {dimensions} from '@/Theme/Variables';
import {Gem} from '@/Models';
import {Button, GemCard} from '@/Commons';
import {useAppSelector} from '@/Hooks';
import {
  showToast,
  useAddGemToPlaybookMutation,
  useGemsByLocationQuery,
  useRemoveGemFromPlaybookMutation,
} from '@/Services';
import DynamicFlatlist from '@/Commons/DynamicFlatlist';
import Modal from '@/Commons/Modal';
import {IAddGemsModal} from './AddGemsModal';
import {Modalize} from 'react-native-modalize';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const AddGemsModal = React.forwardRef<Modalize, IAddGemsModal.IProps>(
  ({gems, playbook_id, playbook_name = ''}, addGemsModalRef) => {
    const location = useAppSelector(state => state.discover.selectedLocation);
    const userGems = useAppSelector(state => state.userDetails.userGems);

    const {t} = useTranslation();
    const [injectedGems, setInjectedGems] = useState<number[]>([]);
    const [selectedGems, setSelectedGems] = useState<number[]>([]);
    const [removedQue, setRemovedQue] = useState<number[]>([]);
    const insets = useSafeAreaInsets();

    const [addGemsToPlaybook, {isSuccess, isLoading, data}] =
      useAddGemToPlaybookMutation();

    const [page, setPage] = useState(1);
    const {
      currentData: discoverGems,
      isLoading: isLoadingGems,
      isFetching: isFetchingGems,
    } = useGemsByLocationQuery(
      {
        locationId: location?.id,
        page: page,
      },
      {
        skip: !location?.id,
      },
    );

    const [
      removeGemsFromPlaybook,
      {isSuccess: isRemoveSuccess, isLoading: isRemoveLoading},
    ] = useRemoveGemFromPlaybookMutation();

    useEffect(() => {
      let initialGems: number[] = gems.map(item => item.id);
      setSelectedGems(initialGems);
      setInjectedGems(initialGems);
    }, [gems]);

    const handleSubmit = () => {
      addGemsToPlaybook({
        user_playbook_id: playbook_id,
        gems: selectedGems,
      });
      removeGemsFromPlaybook({
        user_playbook_id: playbook_id,
        gems: removedQue,
      });
    };

    useEffect(() => {
      if (data && isRemoveSuccess) {
        if (injectedGems.toString() !== selectedGems.toString()) {
          console.log('injectedGems', injectedGems);
          console.log('selectedGems', selectedGems);
          showToast({
            type: 'gem',
            text: t('new_gems_added_toast', {playbookName: playbook_name}),
          });
        }

        (addGemsModalRef as React.RefObject<Modalize>).current?.close();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, isRemoveSuccess, isSuccess, t]);

    const HeaderTitle = () => (
      <View style={styles.headerWrappStyle}>
        <Text style={styles.collectionCounter}>{t('add_gems')}</Text>
      </View>
    );

    const handleOnChooseCard = ({
      isSelected,
      gem,
    }: {
      isSelected: boolean;
      gem: Gem;
    }) => {
      if (isSelected) {
        const findParam = selectedGems.filter(param => param !== gem.id);
        setSelectedGems(findParam);
      } else {
        setSelectedGems([...selectedGems, gem.id]);
      }

      const findFromInitials = injectedGems.includes(gem.id);

      if (isSelected && findFromInitials) {
        setRemovedQue([...removedQue, gem.id]);
      } else if (!isSelected && findFromInitials) {
        const filterFromQue = removedQue.filter(gemId => gemId !== gem.id);
        setRemovedQue(filterFromQue);
      }
    };

    const renderGems = (item: {item: Gem}) => {
      const gem = item.item;
      const isSelected = selectedGems?.includes(gem?.id);
      const isInjected = injectedGems?.includes(gem?.id);
      if (isInjected) {
        return null;
      }
      return (
        <GemCard
          isSelected={isSelected}
          variant="checkbox"
          key={gem.id}
          gem={gem}
          onPress={() => handleOnChooseCard({isSelected, gem})}
          style={styles.gemCard}
        />
      );
    };

    let userGemsIds = userGems.map(item => item.id);

    const isSubset = userGemsIds.every(element =>
      injectedGems.includes(element),
    );

    return (
      <View>
        <Modal
          panGestureEnabled={true}
          customRef={addGemsModalRef as React.RefObject<{}>}
          FooterComponent={
            <Button
              title={t('done')}
              style={[
                styles.buttonCreate,
                {bottom: Math.max(20, insets.bottom)},
              ]}
              onPress={handleSubmit}
              isLoading={isLoading || isRemoveLoading}
            />
          }>
          <>
            <HeaderTitle />
            <View style={styles.mainWrapper}>
              {userGems.length > 0 && !isSubset ? (
                <View style={styles.listContentContainer}>
                  <Text style={styles.subtitleStyle}>
                    {t('gem_available_your_collection')}
                  </Text>
                  {userGems.map(gem => renderGems({item: gem}))}
                </View>
              ) : (
                <DynamicFlatlist
                  isLoading={isLoadingGems}
                  isFetching={isFetchingGems}
                  data={discoverGems?.data?.data ?? []}
                  keyExtractor={(item: any) => JSON.stringify(item)}
                  renderItem={renderGems}
                  pageCallBack={setPage}
                />
              )}
            </View>
          </>
        </Modal>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  buttonCreate: {
    position: 'absolute',
    width: dimensions.width * 0.92,
    alignSelf: 'center',
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },

  mainWrapper: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  headerWrappStyle: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.gray30,
  },
  collectionTitle: {
    ...typography.h1,
    width: dimensions.width * 0.75,
  },
  collectionCounter: {
    ...typography.h4,
    marginVertical: 5,
    color: colors.black,
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
  listContentContainer: {
    paddingBottom: 100,
  },
  subtitleStyle: {
    ...typography.h5,
    justifyContent: 'flex-start',
    width: dimensions.width * 0.9,
    marginVertical: 10,
  },
});

export default AddGemsModal;
