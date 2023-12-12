import {GEM_CATEGORIES} from '@/constants/gemCategories';
import {colors, SVG} from '@/Theme';
import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE, Region} from 'react-native-maps';
import {SvgProps} from 'react-native-svg';
import {IMap} from './Map';
import MapStyle from './map-style.json';

const Map: React.FC<IMap.IProps> = ({
  markers,
  categoriesOfGems,
  filledIcons,
  ...props
}) => {
  const initialRegion: Region = useMemo(() => {
    const minLat = Math.min(...markers.map(x => x.latitude));
    const minLng = Math.min(...markers.map(x => x.longitude));
    const maxLat = Math.max(...markers.map(x => x.latitude));
    const maxLng = Math.max(...markers.map(x => x.longitude));
    const centLat = (minLat + maxLat) / 2;
    const centLng = (minLng + maxLng) / 2;
    const deltaLat = Math.max(
      Math.abs(maxLat - centLat) * 3,
      Math.abs(centLat - minLat) * 3,
      0.02,
    );
    const deltaLnt = Math.max(
      Math.abs(maxLng - centLng) * 3,
      Math.abs(centLng - minLng) * 3,
      0.02,
    );
    return {
      latitude: centLat,
      longitude: centLng,
      latitudeDelta: deltaLat,
      longitudeDelta: deltaLnt,
    };
  }, [markers]);

  const RenderIcon = ({index}: {index: number}) => {
    const id =
      categoriesOfGems &&
      categoriesOfGems.length > 0 &&
      index >= 0 &&
      index < categoriesOfGems.length
        ? categoriesOfGems[index]
        : 0;

    const IconComp: React.FC<SvgProps> | null =
      id && id >= 1 && id <= GEM_CATEGORIES.length
        ? filledIcons
          ? GEM_CATEGORIES[id - 1].fill
          : GEM_CATEGORIES[id - 1].clean
        : filledIcons
        ? SVG.EmptyMarker
        : SVG.Empty;

    return IconComp ? <IconComp height={50} width={50} /> : null;
  };

  return (
    <MapView
      provider={PROVIDER_GOOGLE}
      customMapStyle={MapStyle}
      initialRegion={initialRegion}
      loadingEnabled={true}
      {...props}>
      {markers.map((m, i) => (
        <Marker coordinate={m} key={i} title={m.title}>
          <RenderIcon index={i} />
          <View style={styles.circleTag} />
        </Marker>
      ))}
    </MapView>
  );
};

export default Map;

const styles = StyleSheet.create({
  circleTag: {
    backgroundColor: colors.primary,
    width: 7,
    height: 7,
    alignSelf: 'center',
    marginTop: 5,
    borderRadius: 100,
  },
});
