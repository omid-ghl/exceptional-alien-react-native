import React, {useCallback} from 'react';
import {View, StyleSheet, Linking, Platform} from 'react-native';

import {Button, Map} from '@/Commons';
import {StackScreenProps} from '@react-navigation/stack';
import {StackParamList} from '@/Navigators/Stacks';
import {variables} from '@/Theme';
import {MapHeader} from '../Components';
import {useTranslation} from 'react-i18next';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const MapView: React.FC<StackScreenProps<StackParamList, 'mapView'>> = ({
  route: {
    params: {markers, categoriesOfGems, filledIcons, showNativeMapsButton},
  },
}) => {
  const goToNativeMaps = useCallback(async () => {
    if (!markers || markers.length === 0 || !markers[0]?.latitude) {
      return;
    }
    const scheme = Platform.select({ios: 'maps:0,0?q=', android: 'geo:0,0?q='});
    const latLng = `${markers[0].latitude},${markers[0].longitude}`;
    const url = `${scheme}${latLng}`;

    if (await Linking.canOpenURL(url)) {
      await Linking.openURL(url);
    }
  }, [markers]);
  const {t} = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <Map
        style={styles.map}
        markers={markers}
        categoriesOfGems={categoriesOfGems}
        filledIcons={filledIcons}
      />
      <MapHeader />
      {showNativeMapsButton && (
        <Button
          title={t('gem_detail.get_directions')}
          onPress={goToNativeMaps}
          style={[
            styles.getDirectionsButton,
            {marginBottom: Math.max(insets.bottom, 8)},
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  map: {
    flex: 1,
  },
  getDirectionsButton: {
    position: 'absolute',
    bottom: 0,
    width: variables.dimensions.width * 0.9,
    alignSelf: 'center',
  },
});

export default MapView;
