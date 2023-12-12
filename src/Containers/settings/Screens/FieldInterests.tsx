import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet, Text, FlatList, ListRenderItem} from 'react-native';

import {StackScreenProps} from '@react-navigation/stack';
import {StackParamList} from '@/Navigators/Stacks';
import {colors, typography} from '@/Theme';
import {useTranslation} from 'react-i18next';
import {useListIndustriesQuery, useUpsertInterestsMutation} from '@/Services';
import {Button} from '@/Commons';
import LinearGradient from 'react-native-linear-gradient';
import {setSelectedIndustries} from '@/Store/onboarding';
import {InterestItem} from '../Components';
import {Industry} from '@/Models';
import {useAppDispatch, useAppSelector} from '@/Hooks';

const FieldInterests: React.FC<
  StackScreenProps<StackParamList, 'fieldInterests'>
> = ({navigation}: any) => {
  const {isLoading, data} = useListIndustriesQuery();
  const [selected, setSelected] = useState<number[]>([]);
  const {t} = useTranslation();
  const dispatch = useAppDispatch();

  const interestedIndustries = useAppSelector(
    state => state.onboarding.selectedIndustries,
  );

  const [
    saveIndustries,
    {
      isSuccess: saveIndustriesIsSuccess,
      isLoading: updatingIndustries,
      data: updatedIndustries,
    },
  ] = useUpsertInterestsMutation();

  useEffect(() => {
    setSelected(interestedIndustries);
  }, [interestedIndustries]);

  const toggleSelected = useCallback((id: number) => {
    setSelected(p => {
      const index = p.indexOf(id);
      const cloned = [...p];
      if (index === -1) {
        cloned.push(id);
      } else {
        cloned.splice(index, 1);
      }
      return cloned;
    });
  }, []);

  const renderItem: ListRenderItem<Industry> = ({item}) => {
    return (
      <InterestItem
        text={item.name}
        imageUrl={item.image_url.url}
        selected={selected.includes(item.id)}
        onPress={() => toggleSelected(item.id)}
      />
    );
  };

  useEffect(() => {
    if (saveIndustriesIsSuccess) {
      const formalizeUpdatedArray: number[] = [];
      updatedIndustries?.forEach(item => {
        if (item.interest_type === 'industry') {
          formalizeUpdatedArray.push(parseInt(item.interest_id, 10));
        }
      });
      dispatch(setSelectedIndustries(formalizeUpdatedArray));
      setTimeout(() => {
        navigation.goBack();
      }, 1000);
    }
  }, [dispatch, navigation, saveIndustriesIsSuccess, updatedIndustries]);

  const saveSelected = () => {
    saveIndustries({type: 'industry', interests: selected});
  };

  let SortedData = data
    ? data
        .slice()
        .sort((a: Industry, b: Industry) => b?.name - a?.name)
        .reverse()
    : [];

  return (
    <View style={styles.container}>
      <View style={styles.safeArea}>
        <View style={styles.flatListContainer}>
          <LinearGradient
            colors={['#FFFFFF00', '#FFFFFFFF']}
            style={styles.gradient}
            pointerEvents="none"
          />
          <FlatList
            style={styles.flatList}
            numColumns={2}
            data={SortedData}
            renderItem={renderItem}
            ListHeaderComponent={() => (
              <Text style={styles.title}>{t('which_creative_fields')}</Text>
            )}
            contentContainerStyle={styles.flatListContentContainer}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title={t('save')}
            style={styles.buttonSignIn}
            onPress={saveSelected}
            disable={selected.length === 0}
            isLoading={isLoading || updatingIndustries}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  title: {
    ...typography.h1,
    marginBottom: 40,
    marginHorizontal: 8,
  },
  description: {
    ...typography.h5,
    color: colors.gray100,
    marginTop: 16,
    marginHorizontal: 16,
  },
  flatList: {
    flex: 1,
  },
  flatListContainer: {
    flex: 1,
  },
  flatListContentContainer: {
    paddingHorizontal: 8,
    paddingBottom: 124,
    paddingTop: 60,
  },
  buttonSignIn: {
    marginBottom: 8,
  },
  gradient: {
    height: 124,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    marginBottom: 18,
  },
});

export default FieldInterests;
