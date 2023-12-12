import {Button} from '@/Commons';
import {StackParamList} from '@/Navigators/Stacks';
import {useListIndustriesQuery} from '@/Services';
import {colors, typography} from '@/Theme';
import {StackScreenProps} from '@react-navigation/stack';
import React, {useCallback, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList, ListRenderItem, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {InterestItem} from '../Components';
import LinearGradient from 'react-native-linear-gradient';
import {Industry} from '@/Models';
import {setSelectedIndustries} from '@/Store/onboarding';
import {useAppDispatch} from '@/Hooks';

const SelectIndustries: React.FC<
  StackScreenProps<StackParamList, 'selectIndustries'>
> = ({navigation}) => {
  const {isLoading, data} = useListIndustriesQuery();
  const [selected, setSelected] = useState<number[]>([]);
  const {t} = useTranslation();
  const dispatch = useAppDispatch();

  const goToNextScreen = useCallback(() => {
    navigation.navigate('onboardingLoading');
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

  const renderItem: ListRenderItem<Industry> = ({item}) => {
    return (
      <InterestItem
        text={item.name}
        imageUrl={item.image_url?.url}
        selected={selected.includes(item.id)}
        onPress={() => toggleSelected(item.id)}
      />
    );
  };

  let SortedData = data
    ? data
        .slice()
        .sort((a: Industry, b: Industry) => b?.name - a?.name)
        .reverse()
    : [];

  const saveSelected = useCallback(() => {
    dispatch(setSelectedIndustries(selected));
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

export default SelectIndustries;
