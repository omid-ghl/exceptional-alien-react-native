import React, {useCallback, useEffect, useState} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

import {StackScreenProps} from '@react-navigation/stack';
import {StackParamList} from '@/Navigators/Stacks';
import {colors, SVG} from '@/Theme';
import {createTabs} from '@/Commons';
import {t} from 'i18next';
import GemsList from '../Components/Gems';
import PlayBooksList from '../Components/PlayBooks';
import Header from '../Components/Header';
import {
  useClosestLocationQuery,
  useLocationByIdQuery,
  useRandomLocationQuery,
} from '@/Services/modules/discover';
import {useAppDispatch, useAppSelector} from '@/Hooks';
import {setSearchLocation, updateSearchLocation} from '@/Store/discover';
import {Host} from 'react-native-portalize';
import { BottomTabBarContext } from "@/Navigators/TabBarNavigator";

const Tabs = createTabs();

const Search: React.FC<StackScreenProps<StackParamList, 'search'>> = ({
  navigation,
  route: {params},
}) => {
  const dispatch = useAppDispatch();
  const InitialActiveTab = React.useContext(BottomTabBarContext);
  const selectedLocation = useAppSelector(s => s.discover.selectedLocation);
  const [currentPosition, setCurrentPosition] =
    useState<Geolocation.GeoPosition>();

  const {
    data: closestLocation,
    isLoading: isLoadingLocation,
    isFetching: isFetchingLocation,
  } = useClosestLocationQuery(
    {
      lat: currentPosition?.coords.latitude,
      lng: currentPosition?.coords.longitude,
    },
    {
      skip:
        !currentPosition?.coords.latitude || !currentPosition?.coords.longitude,
    },
  );

  const {data: randomLocation} = useRandomLocationQuery(
    {},
    {
      skip:
        !!closestLocation?.id ||
        isLoadingLocation ||
        isFetchingLocation ||
        !!currentPosition ||
        !!selectedLocation?.id,
    },
  );

  const {data: locationDetails} = useLocationByIdQuery(
    {id: closestLocation?.id ?? randomLocation?.id},
    {
      skip: !(closestLocation?.id ?? randomLocation?.id),
    },
  );

  const pureGeoGetter = useCallback(() => {
    Geolocation.getCurrentPosition(setCurrentPosition, _e => {}, {
      enableHighAccuracy: false,
      timeout: 5000,
      maximumAge: 10000,
    });
  }, []);

  const GetGeo = useCallback(async () => {
    if (Platform.OS === 'ios') {
      const isGranted = await Geolocation.requestAuthorization('whenInUse');
      if (isGranted === 'granted') {
        pureGeoGetter();
      }
    }

    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'EA needs to access your location',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
          message:
            'EA needs to know your location to show suggestions around you',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        pureGeoGetter();
      }
    }
  }, [pureGeoGetter]);

  useEffect(() => {
    GetGeo();
  }, [GetGeo]);

  useEffect(() => {
    if (closestLocation?.id) {
      dispatch(setSearchLocation(closestLocation));
    }
  }, [dispatch, closestLocation]);

  useEffect(() => {
    if (locationDetails) {
      dispatch(updateSearchLocation(locationDetails));
    }
  }, [dispatch, locationDetails]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoiding}>
        <Header
          isLoading={!selectedLocation && !closestLocation && !randomLocation}
          navigation={navigation}
          location={selectedLocation ?? closestLocation ?? randomLocation}
        />
        <Host>
          <Tabs.Navigator
            initialRouteName={InitialActiveTab}
            tabBarPosition={'bottom'}
            screenOptions={{
              tabBarStyle: styles.tabBarStyle,
            }}>
            <Tabs.Screen
              name="Gems"
              component={GemsList}
              options={{
                tabBarLabel: t('gems') || "",
                tabBarIcon: ({color}) => (
                  <SVG.Gem width={20} height={20} stroke={color} />
                ),
              }}
              initialParams={{
                locationId: closestLocation?.id ?? randomLocation?.id,
              }}
            />
            <Tabs.Screen
              name="Playbooks"
              component={PlayBooksList}
              options={{
                tabBarLabel: t('play_books') || "",
                tabBarIcon: ({color}) => (
                  <SVG.Playbooks
                    width={22}
                    height={22}
                    stroke={color}
                    strokeWidth={2}
                  />
                ),
              }}
              initialParams={{
                locationId: closestLocation?.id ?? randomLocation?.id,
              }}
            />
          </Tabs.Navigator>
        </Host>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoiding: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  tabBarStyle: {
    marginBottom: 10,
    position: "absolute",
    elevation: 0,
    backgroundColor: "white",
    left: 10,
    right: 10,
    bottom: 0
  }
});

export default Search;
