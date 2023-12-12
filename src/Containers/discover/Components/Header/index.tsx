import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import {colors, SVG, typography, variables} from '@/Theme';
import {useTranslation} from 'react-i18next';
import {IDiscoverHeader} from './Header';

const Header: React.FC<IDiscoverHeader.IProps> = ({
  navigation,
  isLoading,
  location,
}) => {
  const {t} = useTranslation();

  return (
    <View>
      {isLoading ? (
        <ActivityIndicator style={styles.activityIndicator} />
      ) : (
          <View style={styles.titleWrapper}>
            <Text style={styles.titleText} numberOfLines={1}>{location?.name}</Text>
            <View style={styles.locationWrapper}>
                 <Text style={styles.geoText}>
                   {location?.lat_long.split(',')[0]}
                 </Text>
                  <Text style={styles.geoText}>
                    {location?.lat_long.split(',')[1]}
                  </Text>
            </View>
          </View>
      )}

      <TouchableOpacity
        onPress={() => navigation.navigate('discoverLocations')}
        style={styles.inputWrapper}>
        <SVG.Search
          width={17}
          height={17}
          stroke={colors.primary}
          style={styles.searchIcon}
        />
        <Text style={{color: colors.gray50}}>{t('search_by_location')}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  titleText: {
    ...typography.h1,
    marginLeft: 16,
    maxWidth: variables.dimensions.width - 142,
  },
  tagContainer: {
    paddingHorizontal: 7,
    borderRadius: 40,
    flexDirection: 'row',
    alignItems: 'center',
    height: 34,
    marginRight: 10,
    borderWidth: 1,
  },
  marginHorizontal16: {marginHorizontal: 16, marginBottom: 10},
  tagText: {
    ...typography.caption,
  },
  geoText: {
    ...typography.h5,
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 36,
  },
  inputWrapper: {
    height: 48,
    marginHorizontal: 16,
    marginVertical: 22,
    borderWidth: 1,
    borderColor: colors.gray30,
    borderRadius: 100,
    flexDirection: 'row',
    alignItems: 'center',
  },
  alignRight: {alignItems: 'flex-end'},
  searchIcon: {marginLeft: 15, marginRight: 5},
  skeletonTitleStyle: {borderRadius: 30, marginRight: 10},
  activityIndicator: {
    marginTop: 20
  },
  locationWrapper: {
    marginEnd: 16,
    alignItems: "flex-end",
  },
});

export default Header;
