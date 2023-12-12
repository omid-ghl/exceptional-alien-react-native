import React, {useEffect, useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {StackScreenProps} from '@react-navigation/stack';
import {StackParamList} from '@/Navigators/Stacks';
import {colors, SVG, typography, variables} from '@/Theme';
import {useTranslation} from 'react-i18next';
import {useLocationsListQuery} from '@/Services/modules/discover';
import {Location} from '@/Models';
import {generateRandomNumber} from '@/Utils';
import {useAppDispatch, useAppSelector} from '@/Hooks';
import {setSearchLocation} from '@/Store/discover';
import AsyncStorage from '@react-native-async-storage/async-storage';
import fonts from '../../../Theme/Fonts';
import {normalizeFontSize} from '@/Utils/normalizeFontSize';
import Colors from "@/Theme/Colors";

const DiscoverLocations: React.FC<
  StackScreenProps<StackParamList, 'discoverLocations'>
> = ({navigation}) => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();

  const [filter, setFilter] = useState<string>();
  const globalSelectedLocation = useAppSelector(
    s => s.discover.selectedLocation,
  );
  const [selectedLocation, setSelectedLocation] = useState<
    Location | undefined
  >(globalSelectedLocation ?? undefined);
  const [inputPlaceholder, setInputPlaceholder] = useState<string>();
  const [storedLocationsList, setStoredLocationsList] = useState<Location[]>(
    [],
  );

  const {
    data: locations,
    isLoading: isLoadingLocations,
    isFetching: isFetchingLocations,
  } = useLocationsListQuery(undefined, {
    selectFromResult: result => ({
      ...result,
      data: result.data?.filter(x => x.count_of_playbooks > 0),
    }),
  });

  const filteredLocations = filter
    ? locations?.filter((item: Location) =>
        item?.name.toLowerCase()?.includes(filter?.toLowerCase()),
      )
    : [];

  const renderLocation = ({item}: {item: Location}) => {
    const {id, name} = item;
    const isSelected = selectedLocation?.id === id;

    return (
      <TouchableOpacity
        onPress={() => {
          dispatch(setSearchLocation(item));
          setSelectedLocation(item);
          setInputPlaceholder(name);
          setTimeout(() => {
            navigation.goBack();
          }, 300);
        }}
        style={styles.itemsWrapper}>
        <Text
          style={[
            styles.locationStyle,
            {
              color: isSelected ? colors.primary : colors.black,
            },
          ]}>
          {name}
        </Text>
        {isSelected ? <SVG.ExplorePlaces /> : <SVG.Plus />}
      </TouchableOpacity>
    );
  };

  const finalData =
    filter && filteredLocations && filteredLocations.length > 0
      ? filteredLocations
      : locations;

  const noResult =
    filter && (!filteredLocations || filteredLocations.length === 0);

  const renderEmptyList = () => {
    const generatedArray = new Array(20).fill(0);
    return (
      <>
        {isLoadingLocations || isFetchingLocations ? (
          generatedArray.map((_, i) => (
            <View key={i} style={styles.skeletonWrapper}>
              <View
                style={[
                  styles.fakeLocationStyle,
                  {
                    width:
                      variables.dimensions.width / generateRandomNumber(2, 5),
                  },
                ]}
              />
              <SVG.Plus />
            </View>
          ))
        ) : (
          <Text>Nothing to show</Text>
        )}
      </>
    );
  };

  const renderHeader = () => {
    return (
      <>
        {!isLoadingLocations && !isFetchingLocations && noResult && (
          <View style={styles.noResultContainer}>
            <SVG.LocationMarker />
            <Text style={styles.noResultTitle}>{t('no_result_found')}</Text>
            <Text style={styles.noResultDescription}>
              {t('no_result_found_description')}
            </Text>
          </View>
        )}
        <Text style={styles.titleWrapper}>
          {t(
            filter
              ? noResult
                ? 'choose_place'
                : 'results'
              : 'or_choose_place',
          )}
        </Text>
      </>
    );
  };

  useEffect(() => {
    (async () => {
      if (finalData?.length) {
        await AsyncStorage.setItem('@LOCATIONS', JSON.stringify(finalData));
      }
    })();
  }, [finalData]);

  useEffect(() => {
    (async () => {
      await AsyncStorage.getItem('@LOCATIONS').then((locations: string) => {
        setStoredLocationsList(JSON.parse(locations));
      });
    })();
  }, []);

  return (
    <SafeAreaView style={styles.contentWrapper}>
      <View style={styles.inputWrapper}>
        <SVG.Search
          width={17}
          height={17}
          stroke={colors.primary}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.inputStyle}
          value={filter}
          onChangeText={setFilter}
          placeholder={inputPlaceholder ?? (t('search_by_location') as string)}
        />
      </View>
      <View style={styles.searchListWrapper}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={finalData ?? storedLocationsList ?? []}
          keyExtractor={(item: Location) => item.id.toString()}
          ListEmptyComponent={renderEmptyList}
          renderItem={renderLocation}
          ListHeaderComponent={renderHeader}
          stickyHeaderIndices={[]}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  inputStyle: {
    width: variables.dimensions.width * 0.7,
  },
  contentWrapper: {flex: 1, backgroundColor: Colors.white},
  locationStyle: {
    fontFamily: fonts.medium,
    color: colors.black,
    fontSize: normalizeFontSize(30),
    textTransform: 'uppercase',
  },
  fakeLocationStyle: {
    backgroundColor: colors.gray30,
    height: 40,
    borderRadius: 15,
  },
  itemsWrapper: {flexDirection: 'row', alignItems: 'center', marginBottom: -5},
  skeletonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    marginBottom: 6,
  },
  searchListWrapper: {
    width: variables.dimensions.width * 0.9,
    alignSelf: 'center',
    flex: 1,
  },
  titleWrapper: {
    ...typography.h5,
    marginVertical: 26,
  },
  inputWrapper: {
    height: 48,
    marginHorizontal: 16,
    marginTop: 45,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: colors.gray30,
    borderRadius: 100,
    flexDirection: 'row',
    alignItems: 'center',
  },
  alignCenter: {alignItems: 'center'},
  searchIcon: {marginLeft: 15, marginRight: 5},
  noResultContainer: {
    borderWidth: 1,
    borderColor: colors.gray30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  noResultTitle: {
    ...typography.h4,
    marginTop: 14,
  },
  noResultDescription: {
    ...typography.caption,
    color: colors.gray100,
    marginTop: 14,
    width: '66%',
    textAlign: 'center',
  },
});

export default DiscoverLocations;
