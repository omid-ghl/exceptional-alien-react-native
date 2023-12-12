import {Button} from '@/Commons';
import {AppConfig} from '@/Config';
import {Location} from '@/Models';
import {StackParamList} from '@/Navigators/Stacks';
import {useListLocationsQuery, useOnboardingPrefetch} from '@/Services';
import {colors, typography} from '@/Theme';
import {StackScreenProps} from '@react-navigation/stack';
import React, {useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList, ListRenderItem, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {InterestItem} from '../Components';
import LinearGradient from 'react-native-linear-gradient';
import {setSelectedLocations} from '@/Store/onboarding';
import {useAppDispatch} from '@/Hooks';

const SelectLocations: React.FC<
  StackScreenProps<StackParamList, 'selectLocations'>
> = ({navigation}) => {
  const {isLoading, data, isSuccess} = useListLocationsQuery();
  const [selected, setSelected] = useState<number[]>([]);
  const {t} = useTranslation();
  const prefetchIndustries = useOnboardingPrefetch('listIndustries');
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isSuccess) {
      prefetchIndustries();
    }
  }, [isSuccess, prefetchIndustries]);

  const goToNextScreen = useCallback(() => {
    navigation.navigate('selectIndustries');
  }, [navigation]);

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

  const saveSelected = useCallback(() => {
    dispatch(setSelectedLocations(selected));
  }, [selected, dispatch]);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
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
            title={t('next')}
            style={styles.buttonSignIn}
            onPress={() => {
              saveSelected();
              goToNextScreen();
            }}
            disable={selected.length === 0}
            isLoading={isLoading}
          />
          <Button
            title={t('skip')}
            type={'secondary'}
            onPress={goToNextScreen}
          />
        </View>
      </SafeAreaView>
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
    marginBottom: 8,
  },
});

export default SelectLocations;
