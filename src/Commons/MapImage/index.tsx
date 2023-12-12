import {AppConfig} from '@/Config';
import {GEM_CATEGORY_ICONS_BASE_URL} from '@/constants/common';
import {GEM_CATEGORIES} from '@/constants/gemCategories';
import {variables} from '@/Theme';
import React, {useMemo} from 'react';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import {IMapImage} from './MapImage';

const width = variables.dimensions.width;

const staticMapUri =
  'https://maps.googleapis.com/maps/api/staticmap?key=API_KEY&MARKERS&format=png&maptype=roadmap&style=element:geometry%7Ccolor:0xf5f5f5&style=element:labels.icon%7Cvisibility:off&style=element:labels.text.fill%7Ccolor:0x616161&style=element:labels.text.stroke%7Ccolor:0xf5f5f5&style=feature:administrative%7Celement:labels.text.fill%7Ccolor:0x372ce8&style=feature:administrative.land_parcel%7Celement:labels.text.fill%7Ccolor:0xbdbdbd&style=feature:landscape%7Celement:geometry.fill%7Ccolor:0xf2f2f2&style=feature:poi%7Celement:geometry%7Ccolor:0xeeeeee&style=feature:poi%7Celement:labels.text.fill%7Ccolor:0x757575&style=feature:poi.park%7Celement:geometry%7Ccolor:0xe5e5e5&style=feature:poi.park%7Celement:labels.text.fill%7Ccolor:0x9e9e9e&style=feature:road%7Celement:geometry%7Ccolor:0xffffff&style=feature:road.arterial%7Celement:labels.text.fill%7Ccolor:0x757575&style=feature:road.highway%7Celement:geometry%7Ccolor:0xffffff&style=feature:road.highway%7Celement:labels.text.fill%7Ccolor:0x616161&style=feature:road.local%7Celement:geometry.stroke%7Ccolor:0xe2e2e2&style=feature:road.local%7Celement:labels.text.fill%7Ccolor:0x9e9e9e&style=feature:transit.line%7Celement:geometry%7Ccolor:0xe5e5e5&style=feature:transit.station%7Celement:geometry%7Ccolor:0xeeeeee&style=feature:water%7Celement:geometry%7Ccolor:0xc9c9c9&style=feature:water%7Celement:labels.text.fill%7Ccolor:0x9e9e9e&size=WIDTHxHEIGHT';
const MapImage: React.FC<IMapImage.IProps> = ({
  style,
  imageStyle,
  markers,
  onPress,
  mapWidth = width,
  mapHeight = 500,
  zoom = 10,
}) => {
  const getMapUri = useMemo(() => {
    if (
      !AppConfig.GOOGLE_PLACES_API_KEY ||
      !markers ||
      markers.length === 0 ||
      !markers[0]?.latitude ||
      !markers[0]?.longitude
    ) {
      return null;
    }
    let uri = staticMapUri
      .replace('API_KEY', AppConfig.GOOGLE_PLACES_API_KEY as string)
      .replace(
        'MARKERS',
        `${markers
          .map(x => {
            let markerPrefix = 'color:blue';
            if (
              x.gemCategoryId &&
              x.gemCategoryId >= 1 &&
              x.gemCategoryId <= GEM_CATEGORIES.length
            ) {
              markerPrefix = `icon:${GEM_CATEGORY_ICONS_BASE_URL}${
                x.filled
                  ? GEM_CATEGORIES[x.gemCategoryId - 1].fillStaticPngName
                  : GEM_CATEGORIES[x.gemCategoryId - 1].cleanStaticPngName
              }`;
            }
            return `markers=${markerPrefix}%7C${x.latitude.toString()},${x.longitude.toString()}`;
          })
          .join('&')}`,
      )
      .replace('WIDTH', mapWidth.toString())
      .replace('HEIGHT', mapHeight.toString());
    if (markers.length === 1) {
      uri += `&zoom=${zoom.toString()}`;
    }
    // console.log(uri);
    return uri;
  }, [mapHeight, mapWidth, markers, zoom]);

  return (
    <TouchableOpacity onPress={onPress} style={style} activeOpacity={0.7}>
      {getMapUri && (
        <Image
          source={{uri: getMapUri}}
          style={[styles.image, imageStyle]}
          resizeMode="cover"
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  image: {
    flex: 1,
  },
});

export default MapImage;
