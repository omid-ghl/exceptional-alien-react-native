import React, {useCallback, useEffect} from 'react';
import {View, StyleSheet, ActivityIndicator, Platform} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import VersionInfo from 'react-native-version-info';

import {colors} from '@/Theme';
import {
  TokenStorage,
  useLazyCheckTokenQuery,
  useLazyGemsByLocationQuery,
  useLazyUserGemsListQuery,
  useLazyUserInterestedListQuery,
  useLazyUserPlaybooksListQuery,
} from '@/Services';
import {useAppDispatch} from '@/Hooks';
import {setToken} from '@/Store/auth';
import {StackScreenProps} from '@react-navigation/stack';
import {StackParamList} from '@/Navigators/Stacks';
import {AppConfig} from '@/Config';
import {setSelectedIndustries, setSelectedLocations} from '@/Store/onboarding';
import {
  setCreatedUserPlaybooks,
  setUserGems,
  setUserPlaybooks,
} from '@/Store/userDetails';
import {
  useDisvocerPrefetch,
  useLazyClosestLocationQuery,
  useLazyLocationByIdQuery,
  useLazyRandomLocationQuery,
} from '@/Services/modules/discover';
import {updateSearchLocation} from '@/Store/discover';
import {
  useLazyGetPlaybooksCreatedByUserQuery,
  useLazyPlaybooksByLocationQuery,
} from '@/Services/modules/playbooks';
import FastImage from 'react-native-fast-image';
import SplashScreen from 'react-native-splash-screen';
import {Location} from '@/Models';
import {useLazyCheckLatestAppVersionQuery} from '@/Services/modules/initial';

console.log('Environment:', AppConfig.ENVIRONMENT);
console.log('API_URL:', AppConfig.API_URL);
const MINIMUM_DELAY_MS = 1000;

const Splash: React.FC<StackScreenProps<StackParamList, 'splash'>> = ({
  navigation: {reset, getState: getNavigationState},
  route: {params},
}) => {
  const dispatch = useAppDispatch();
  const hasLoading = params?.hasLoading ?? false;
  const goToUrl = params?.goToUrl;

  const [checkToken] = useLazyCheckTokenQuery();

  const [checkLatestAppVersion] = useLazyCheckLatestAppVersionQuery();
  const prefetchIndustries = useDisvocerPrefetch('gemCategories');
  const prefetchLocationsList = useDisvocerPrefetch('locationsList');

  const [getUserGems] = useLazyUserGemsListQuery();
  const [getUserPlaybooks] = useLazyUserPlaybooksListQuery();
  const [getCreatedPlaybooksByUser] = useLazyGetPlaybooksCreatedByUserQuery();

  const [getUserInterestedList] = useLazyUserInterestedListQuery();

  const [getClosestLocation] = useLazyClosestLocationQuery();
  const [getRandomLocation] = useLazyRandomLocationQuery();
  const [getLocationById] = useLazyLocationByIdQuery();

  const [getGemsByLocation] = useLazyGemsByLocationQuery();
  const [getPlaybooksByLocation] = useLazyPlaybooksByLocationQuery();

  const checkVersioning = useCallback(async () => {
    try {
      const latestAppVersion = await checkLatestAppVersion({}).unwrap();

      const checkingPath = latestAppVersion?.data;
      const itsSameVersioning =
        VersionInfo.appVersion >=
        (Platform.OS === 'ios'
          ? checkingPath.app_settings_ios_minimum_version
          : checkingPath.app_settings_android_minimum_version);

      if (latestAppVersion?.data && !itsSameVersioning) {
        console.error('App needed to be Update !');
        SplashScreen.hide();
        reset({
          routes: [
            {
              name: 'syncAppVersion',
            },
          ],
        });
      }
    } catch (error) {}
  }, [checkLatestAppVersion, reset]);

  const prefetchUserGems = useCallback(async () => {
    try {
      const userGems = await getUserGems().unwrap();
      if (userGems) {
        dispatch(setUserGems(userGems));
      }
    } catch (error) {}
  }, [dispatch, getUserGems]);

  const prefetchUserPlaybooks = useCallback(async () => {
    try {
      const userPlaybooks = await getUserPlaybooks().unwrap();
      if (userPlaybooks) {
        dispatch(setUserPlaybooks(userPlaybooks));
      }
    } catch (error) {}
  }, [dispatch, getUserPlaybooks]);

  const prefetchPlaybooksCreatedByUser = useCallback(async () => {
    try {
      const userCreatedPlaybooks = await getCreatedPlaybooksByUser({}).unwrap();
      if (userCreatedPlaybooks) {
        dispatch(setCreatedUserPlaybooks(userCreatedPlaybooks));
      }
    } catch (error) {}
  }, [dispatch, getCreatedPlaybooksByUser]);

  const prefetchUserInterestedList = useCallback(async () => {
    try {
      const userInterestedList = await getUserInterestedList({}).unwrap();
      const formalizeUserlocationsById: number[] = [];
      const formalizeUserIndustriesById: number[] = [];

      userInterestedList?.forEach(item => {
        if (item.interest_type === 'location') {
          formalizeUserlocationsById.push(parseInt(item.interest_id, 10));
        }
        if (item.interest_type === 'industry') {
          formalizeUserIndustriesById.push(parseInt(item.interest_id, 10));
        }
      });

      dispatch(setSelectedLocations(formalizeUserlocationsById));
      dispatch(setSelectedIndustries(formalizeUserIndustriesById));
    } catch (error) {}
  }, [dispatch, getUserInterestedList]);

  const prefetchGemsAndImages = useCallback(
    async (locationId: number) => {
      try {
        const gems = await getGemsByLocation({
          locationId: locationId,
          page: 1,
        }).unwrap();
        if (!gems?.data?.data || gems.data.data.length === 0) {
          return;
        }

        const imageUrls = gems.data.data
          .slice(0, 3)
          .map(x => x.feature_image)
          .filter(x => !!x && typeof x === 'string' && x.length > 0)
          .map(x => ({uri: `${AppConfig.IMAGE_URL}${x}`}));
        if (imageUrls && imageUrls.length > 0) {
          FastImage.preload(imageUrls);
        }
      } catch (error) {}
    },
    [getGemsByLocation],
  );
  const prefetchPlaybooksAndImages = useCallback(
    async (locationId: number) => {
      try {
        const playbooks = await getPlaybooksByLocation({
          locationId: locationId,
          page: 1,
          perPage: 10,
        }).unwrap();
        if (!playbooks?.data || playbooks.data.length === 0) {
          return;
        }

        const imageUrls = playbooks.data
          .slice(0, 3)
          .map(x => x?.user?.profile_image)
          .filter(x => !!x && typeof x === 'string' && x.length > 0)
          .map(x => ({uri: `${AppConfig.IMAGE_URL}${x}`}));
        if (imageUrls && imageUrls.length > 0) {
          FastImage.preload(imageUrls);
        }
      } catch (error) {}
    },
    [getPlaybooksByLocation],
  );

  const prefetchDiscoverData = useCallback(
    async (location: Location) => {
      try {
        dispatch(updateSearchLocation(location));
        prefetchGemsAndImages(location.id);
        prefetchPlaybooksAndImages(location.id);
        const locationDetails = await getLocationById({
          id: location.id,
        }).unwrap();
        if (!locationDetails?.id) {
          return;
        }
        dispatch(updateSearchLocation(locationDetails));
      } catch (error) {}
    },
    [
      dispatch,
      getLocationById,
      prefetchGemsAndImages,
      prefetchPlaybooksAndImages,
    ],
  );

  const prefetchDiscoverWithGeo = useCallback(
    async (position: Geolocation.GeoPosition) => {
      if (!position?.coords.latitude || !position?.coords.longitude) {
        return;
      }
      try {
        const closestLocation = await getClosestLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }).unwrap();
        if (!closestLocation?.id) {
          return;
        }
        prefetchDiscoverData(closestLocation);
      } catch (error) {}
    },
    [getClosestLocation, prefetchDiscoverData],
  );

  const prefetchDiscoverWithRandomLocation = useCallback(async () => {
    try {
      const randomLocation = await getRandomLocation({}).unwrap();
      if (!randomLocation?.id) {
        return;
      }
      prefetchDiscoverData(randomLocation);
    } catch (error) {}
  }, [getRandomLocation, prefetchDiscoverData]);

  const getUserGeo = useCallback(() => {
    Geolocation.getCurrentPosition(
      prefetchDiscoverWithGeo,
      prefetchDiscoverWithRandomLocation,
      {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 10000,
      },
    );
  }, [prefetchDiscoverWithGeo, prefetchDiscoverWithRandomLocation]);

  const resetNavigationTo = useCallback(
    (name: keyof StackParamList) => {
      const navigationState = getNavigationState();
      if (
        navigationState.routes[navigationState.index].name === 'syncAppVersion' // Do not navigate if the Sync App Version screen is showing
      ) {
        return;
      }
      reset({
        routes: [
          {
            name,
          },
        ],
      });
      SplashScreen.hide();
    },
    [getNavigationState, reset],
  );

  const checkTokenAndNavigate = useCallback(async () => {
    try {
      const userInfo = await checkToken().unwrap();
      console.log('User', userInfo.id, userInfo.email);
      // is_onboarded === null is temporary until the user response is fixed
      if (userInfo.is_onboarded || userInfo.is_onboarded === null) {
        if (goToUrl) {
          goToUrl();
        }
      } else {
        resetNavigationTo('selectLocations');
      }
    } catch (error: any) {
      dispatch(setToken(null));
      if (error?.status === 401) {
        try {
          await TokenStorage.removeToken();
        } catch {}
      }
      resetNavigationTo('getStarted');
    }
  }, [checkToken, dispatch, goToUrl, resetNavigationTo]);

  useEffect(() => {
    checkVersioning();
    TokenStorage.getToken()
      .then(token => {
        if (token && typeof token === 'string' && token.length > 4) {
          dispatch(setToken(token));
          checkTokenAndNavigate();
          prefetchPlaybooksCreatedByUser();
          prefetchUserGems();
          prefetchUserPlaybooks();
          getUserGeo();
          prefetchIndustries();
          prefetchLocationsList();
          prefetchUserInterestedList();
          setTimeout(() => {
            resetNavigationTo('tabBar');
          }, MINIMUM_DELAY_MS);
        } else {
          setTimeout(() => {
            resetNavigationTo('getStarted');
          }, MINIMUM_DELAY_MS);
        }
        console.log('token', token);
      })
      .catch(() => {
        checkTokenAndNavigate();
      });
  }, [
    dispatch,
    prefetchUserInterestedList,
    prefetchIndustries,
    getUserGeo,
    prefetchLocationsList,
    prefetchUserGems,
    prefetchUserPlaybooks,
    prefetchPlaybooksCreatedByUser,
    checkTokenAndNavigate,
    resetNavigationTo,
    checkVersioning,
  ]);

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: hasLoading ? colors.white : colors.primary},
      ]}>
      {hasLoading || goToUrl ? (
        <ActivityIndicator size={'large'} style={styles.indicatorStyle} />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicatorStyle: {
    marginTop: 30,
  },
});

export default Splash;
