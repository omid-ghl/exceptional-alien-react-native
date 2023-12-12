import {AppConfig} from '@/Config';
import {StackParamList} from '@/Navigators/Stacks';
import {
  useListIndustriesQuery,
  useListLocationsQuery,
  useOnboardingCompleteMutation,
  useUpsertInterestsMutation,
} from '@/Services';
import {colors} from '@/Theme';
import {StackScreenProps} from '@react-navigation/stack';
import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {LoadingCaption, LoadingTile} from '../Components';
import {useAppDispatch, useAppSelector} from '@/Hooks';
import {shuffle} from '@/Utils';
import {setGuestMode, setUserJustSignedUp} from '@/Store/auth';
import {useFocusEffect} from '@react-navigation/native';

const OnboardingLoading: React.FC<
  StackScreenProps<StackParamList, 'onboardingLoading'>
> = ({navigation}) => {
  const selectedLocations = useAppSelector(
    state => state.onboarding.selectedLocations,
  );
  const selectedIndustries = useAppSelector(
    state => state.onboarding.selectedIndustries,
  );
  const guestMode = useAppSelector(state => state.auth.guest.guestMode);
  const guestIntendedNavigationState = useAppSelector(
    state => state.navigation.guestIntendedNavigationState,
  );
  const [minimumTimePassed, setMinimumTimePassed] = useState(false);
  const dispatch = useAppDispatch();

  const shouldSaveLocations =
    !!selectedLocations && selectedLocations.length > 0;

  const shouldSaveIndustries =
    !!selectedIndustries && selectedIndustries.length > 0;

  const {data: locations} = useListLocationsQuery();
  const {data: industries} = useListIndustriesQuery();
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    if (!locations || !industries) {
      return;
    }
    const industryImages = industries
      .map(i =>
        selectedIndustries.includes(i.id)
          ? i.image_url?.url &&
            typeof i.image_url.url === 'string' &&
            i.image_url.url.length > 0
            ? i.image_url.url
            : null
          : null,
      )
      .filter(x => !!x) as string[];

    console.log('industryImages', industryImages);

    const locationImages = locations
      .filter(i => !!i.hero_image && selectedLocations.includes(i.id))
      .map(l => `${AppConfig.IMAGE_URL}${l.hero_image}`);

    const allSelected = [...industryImages, ...locationImages];
    shuffle(allSelected);
    setImageUrls(allSelected.slice(0, Math.min(4, allSelected.length)));
  }, [selectedIndustries, selectedLocations, locations, industries]);

  const [saveLocations, {isSuccess: saveLocationIsSuccess}] =
    useUpsertInterestsMutation();
  const [saveIndustries, {isSuccess: saveIndustriesIsSuccess}] =
    useUpsertInterestsMutation();

  const [saveComplete, {isSuccess: saveCompleteIsSuccess}] =
    useOnboardingCompleteMutation();

  useEffect(() => {
    if (shouldSaveLocations) {
      saveLocations({type: 'location', interests: selectedLocations});
    }
  }, [saveLocations, selectedLocations, shouldSaveLocations]);

  useEffect(() => {
    if (shouldSaveIndustries) {
      saveIndustries({type: 'industry', interests: selectedIndustries});
    }
  }, [saveIndustries, selectedIndustries, shouldSaveIndustries]);

  const goToNextScreen = useCallback(() => {
    if (guestMode && guestIntendedNavigationState) {
      dispatch(setGuestMode(false));
      navigation.reset(guestIntendedNavigationState);
      return;
    }
    navigation.reset({
      routes: [{name: 'tabBar', params: {newUser: true}}],
      index: 0,
    });
  }, [guestMode, guestIntendedNavigationState, navigation, dispatch]);

  useFocusEffect(
    useCallback(() => {
      const tm = setTimeout(() => {
        setMinimumTimePassed(true);
      }, 6000);

      return () => {
        clearTimeout(tm);
      };
    }, []),
  );

  useEffect(() => {
    if (
      (!shouldSaveLocations || saveLocationIsSuccess) &&
      (!shouldSaveIndustries || saveIndustriesIsSuccess)
    ) {
      saveComplete({is_onboarded: true});
    }
  }, [
    saveLocationIsSuccess,
    saveIndustriesIsSuccess,
    navigation,
    shouldSaveLocations,
    shouldSaveIndustries,
    goToNextScreen,
    saveComplete,
  ]);

  useEffect(() => {
    if (saveCompleteIsSuccess && minimumTimePassed) {
      dispatch(setUserJustSignedUp(true));
      goToNextScreen();
    }
  }, [dispatch, goToNextScreen, saveCompleteIsSuccess, minimumTimePassed]);

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <View
          style={[styles.imageGroup, {marginLeft: 14 * imageUrls.length - 1}]}>
          {imageUrls.map((imageUrl, i) => (
            <LoadingTile
              key={i}
              imageUrl={imageUrl}
              startAnimationFrom={i % 2 === 0 ? 'top' : 'bottom'}
              offsetX={i * -14}
            />
          ))}
        </View>
        <LoadingCaption style={styles.caption} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'center',
  },
  wrapper: {
    alignItems: 'center',
  },
  caption: {
    width: '60%',
    textAlign: 'center',
    height: 60,
  },
  imageGroup: {
    flexDirection: 'row',
    marginBottom: 28,
  },
});

export default OnboardingLoading;
