import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, ListRenderItem, StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import {StackScreenProps} from '@react-navigation/stack';
import {StackParamList} from '@/Navigators/Stacks';
import {colors, fonts, typography} from '@/Theme';
import {
  useListLocationsQuery,
  useOnboardingPrefetch,
  useUpsertInterestsMutation,
} from '@/Services';
import {AppConfig} from '@/Config';
import {Button} from '@/Commons';
import {setSelectedLocations} from '@/Store/onboarding';
import {useAppDispatch, useAppSelector} from '@/Hooks';
import {useTranslation} from 'react-i18next';
import {InterestItem} from '../Components';
import {Location} from '@/Models';

const PlaceInterests: React.FC<
  StackScreenProps<StackParamList, 'placeInterests'>
> = ({navigation}) => {
  const {isLoading, data, isSuccess} = useListLocationsQuery();
  const [selected, setSelected] = useState<number[]>([]);
  const {t} = useTranslation();
  const prefetchIndustries = useOnboardingPrefetch('listIndustries');
  const dispatch = useAppDispatch();

  const interestedLocations = useAppSelector(
    state => state.onboarding.selectedLocations,
  );

  const [
    saveLocations,
    {
      isSuccess: saveLocationIsSuccess,
      isLoading: updatingLocations,
      data: updatedLocations,
    },
  ] = useUpsertInterestsMutation();

  useEffect(() => {
    setSelected(interestedLocations);
  }, [interestedLocations]);

  useEffect(() => {
    if (isSuccess) {
      prefetchIndustries();
    }
  }, [isSuccess, prefetchIndustries]);

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

  const renderItem: ListRenderItem<Location> = ({item}) => {
    return (
      <InterestItem
        text={item.name}
        imageUrl={`${AppConfig.IMAGE_URL}${item.hero_image}`}
        selected={selected.includes(item.id)}
        onPress={() => toggleSelected(item.id)}
      />
    );
  };

  const saveSelected = () => {
    saveLocations({type: 'location', interests: selected});
  };

  useEffect(() => {
    if (saveLocationIsSuccess) {
      const formalizeUpdatedArray: number[] = [];
      updatedLocations?.forEach(item => {
        if (item.interest_type === 'location') {
          formalizeUpdatedArray.push(parseInt(item.interest_id, 10));
        }
      });
      dispatch(setSelectedLocations(formalizeUpdatedArray));
      setTimeout(() => {
        navigation.goBack();
      }, 1000);
    }
  }, [
    dispatch,
    isSuccess,
    navigation,
    saveLocationIsSuccess,
    updatedLocations,
  ]);

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
            data={data}
            renderItem={renderItem}
            ListHeaderComponent={() => (
              <Text style={styles.title}>{t('which_places_your_vibe')}</Text>
            )}
            contentContainerStyle={styles.flatListContentContainer}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title={'Save'}
            style={styles.buttonSignIn}
            onPress={saveSelected}
            disable={selected.length === 0}
            isLoading={updatingLocations || isLoading}
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
  card: {
    flex: 1,
    borderRadius: 10,
    margin: 4,
    overflow: 'hidden',
  },
  text: {
    ...typography.h5,
    color: colors.white,
  },
  imageContainer: {
    flex: 1,
    width: '100%',
    minHeight: 64,
  },
  image: {
    borderRadius: 10,
  },
  mask: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
});

export default PlaceInterests;
