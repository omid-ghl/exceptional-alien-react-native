import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ListRenderItem,
} from 'react-native';

import {StackScreenProps} from '@react-navigation/stack';
import {StackParamList} from '@/Navigators/Stacks';
import {colors, SVG, typography, variables} from '@/Theme';
import {Button, GemCard} from '@/Commons';
import {useTranslation} from 'react-i18next';
import {dimensions} from '@/Theme/Variables';
import {Gem} from '@/Models';
import {useAppSelector} from '@/Hooks';
import {
  showToast,
  useCreateNewPlaybookMutation,
  useEditPlaybookTitleMutation,
} from '@/Services';
import {useLazyGetPlaybooksCreatedByUserQuery} from '@/Services/modules/playbooks';
import {useDispatch} from 'react-redux';
import {setCreatedUserPlaybooks} from '@/Store/userDetails';
import DynamicFlatlist from '@/Commons/DynamicFlatlist';

const CreatePlaybook: React.FC<
  StackScreenProps<StackParamList, 'createPlaybook'>
> = ({
  navigation,
  route: {
    params: {playbook, editTitle = false, initialGemsIds},
  },
}) => {
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const [playbookName, setPlaybookName] = useState('');
  const [nameIsChoosed, setNameIsChoosed] = useState(false);
  const [selectedGems, setSelectedGems] = useState<number[]>([]);

  const userGems = useAppSelector(state => state.userDetails.userGems);

  const [createPlaybook, {isSuccess, isLoading, data: createPlaybookResult}] =
    useCreateNewPlaybookMutation();

  const [
    editPlaybookTitle,
    {isSuccess: editIsSuccess, isLoading: editIsLoading},
  ] = useEditPlaybookTitleMutation();

  const [
    updateCreatedPlaybooks,
    {
      data: createdPlaybooks,
      isLoading: isLoadingPlaybooks,
      isFetching: isFetchingPlaybooks,
    },
  ] = useLazyGetPlaybooksCreatedByUserQuery();

  useEffect(() => {
    if (createdPlaybooks) {
      dispatch(setCreatedUserPlaybooks(createdPlaybooks));
      const currentPlaybook = createdPlaybooks.find(
        x => x.id === createPlaybookResult?.id,
      );
      const tm = setTimeout(() => {
        navigation.goBack();
        if (
          (initialGemsIds && initialGemsIds.length > 0) ||
          editTitle ||
          playbook
        ) {
          return;
        }
        if (
          (!initialGemsIds || initialGemsIds.length === 0) &&
          !editTitle &&
          currentPlaybook
        ) {
          navigation.navigate('yourGemsByPlaybook', {
            playbook: currentPlaybook,
            createdByMe: true,
          });
        } else {
          navigation.navigate('yourPlaybooks');
        }
      }, 500);

      return () => {
        console.log('clearTimeout');
        clearTimeout(tm);
      };
    }
  }, [
    createPlaybookResult?.id,
    createdPlaybooks,
    dispatch,
    editTitle,
    initialGemsIds,
    navigation,
    playbook,
  ]);

  useEffect(() => {
    if (playbook) {
      setPlaybookName(playbook.title ?? playbook.name);
    }
  }, [playbook]);

  const renderItemGems: ListRenderItem<Gem> = ({item}) => {
    const isSelected = selectedGems?.includes(item?.id);
    return (
      <GemCard
        isSelected={isSelected}
        variant="checkbox"
        onPress={() => {
          if (isSelected) {
            const findParam = selectedGems.filter(param => param !== item.id);
            setSelectedGems(findParam);
          } else {
            setSelectedGems([...selectedGems, item.id]);
          }
        }}
        style={{marginTop: 8}}
        gem={item}
      />
    );
  };

  const createNewOne = () => {
    setNameIsChoosed(true);
  };

  const onCreateNewPlaybook = () => {
    if (initialGemsIds?.length > 0) {
      createPlaybook({name: playbookName, gems: initialGemsIds});
    } else {
      createPlaybook({name: playbookName, gems: selectedGems});
    }
  };

  useEffect(() => {
    if (isSuccess) {
      showToast({
        type: 'playbook',
        text:
          initialGemsIds && initialGemsIds.length > 0
            ? t('new_gems_added_toast', {playbookName})
            : "'" + playbookName + "' " + t('createdLC'),
      });
      updateCreatedPlaybooks({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  const onEditTitle = () => {
    if (playbook?.id) {
      editPlaybookTitle({name: playbookName, user_playbook_id: playbook?.id});
    }
  };

  useEffect(() => {
    if (editIsSuccess) {
      showToast({type: 'playbook', text: t('playbook_title_change')});
      navigation.goBack();
      navigation.goBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editIsSuccess]);

  const onCancel = () => {
    navigation.goBack();
  };

  const updateThisOne = () => {
    setNameIsChoosed(true);
  };

  const createPlaybookTab = (
    <>
      <TouchableOpacity style={styles.iconWrapper} onPress={onCancel}>
        <SVG.Close width={25} height={25} />
      </TouchableOpacity>

      <View style={styles.container}>
        <Text style={styles.titleStyle}>{t('give_playbook_name')}</Text>
        <TextInput
          style={styles.inputStyle}
          textAlign={'center'}
          placeholder="Type"
          onChangeText={setPlaybookName}
          value={playbookName}
          underlineColorAndroid={"transparent"}
        />
        <Button
          isLoading={isLoading || editIsLoading}
          style={styles.buttonStyle}
          title={t(playbook ? 'save' : 'create')}
          type={'primary'}
          onPress={
            initialGemsIds?.length > 0 || (userGems?.length ?? 0) === 0
              ? onCreateNewPlaybook
              : playbook
              ? editTitle
                ? onEditTitle
                : updateThisOne
              : createNewOne
          }
        />
      </View>
    </>
  );

  const chooseGems = (
    <>
      <View style={styles.gemsWrapper}>
        <Text style={styles.titleStyle}>{t('add_gems')}</Text>
      </View>
      <View style={styles.flatlistWrapper}>
        <DynamicFlatlist
          style={styles.headerStyle}
          isFetching={false}
          isLoading={false}
          data={userGems.length > 0 ? userGems : []}
          keyExtractor={(item: Gem) => item.id.toString()}
          renderItem={renderItemGems}
          contentContainerStyle={styles.containerStyle}
          ListHeaderComponent={() => (
            <Text style={styles.subtitleStyle}>
              {t('gems_collection_count')}
            </Text>
          )}
          hasEnded={true}
        />
      </View>
      <Button
        isLoading={isLoading || isLoadingPlaybooks || isFetchingPlaybooks}
        style={styles.doneButtonStyle}
        title={t('done')}
        type={'primary'}
        onPress={onCreateNewPlaybook}
      />
    </>
  );

  return <>{nameIsChoosed ? chooseGems : createPlaybookTab}</>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {right: 22, top: 22, position: 'absolute', zIndex: 100},
  titleStyle: {
    ...typography.h4,
    justifyContent: 'center',
  },
  subtitleStyle: {
    ...typography.h5,
    justifyContent: 'flex-start',
    width: dimensions.width * 0.9,
    marginVertical: 10,
  },
  inputStyle: {
    ...typography.h1,
    width: variables.dimensions.width * 0.85,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray50,
    marginTop: 40,
  },
  buttonStyle: {width: variables.dimensions.width * 0.3, marginTop: 64},

  gemsWrapper: {
    paddingVertical: 20,
    width: dimensions.width,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.gray50,
  },
  flatlistWrapper: {
    width: dimensions.width,
  },
  headerStyle: {marginVertical: 10},
  containerStyle: {paddingBottom: 200, alignItems: 'center'},
  doneButtonStyle: {
    zIndex: 100,
    position: 'absolute',
    bottom: 15,
    width: dimensions.width * 0.95,
    alignSelf: 'center',
  },
});

export default CreatePlaybook;
