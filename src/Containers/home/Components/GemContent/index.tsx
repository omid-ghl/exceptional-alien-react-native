import React, {useCallback, useMemo} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Image,
  View,
  Text,
  FlatList,
  ListRenderItem,
  Linking,
  Platform,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {colors, SVG, typography, variables} from '@/Theme';
import {IGemContent} from './GemContent';
import {GemCard, MapImage} from '@/Commons';
import {Gem} from '@/Models/Gem';
import {useGemLikesQuery, useSimilarGemsQuery} from '@/Services';
import {useNavigation} from '@react-navigation/native';
import {StackParamList} from '@/Navigators/Stacks';
import {StackNavigationProp} from '@react-navigation/stack';
import {AppConfig} from '@/Config';
import RenderHTML from 'react-native-render-html';

const GemContent = (props: IGemContent.IProps) => {
  const {t} = useTranslation();
  const navigation =
    useNavigation<StackNavigationProp<StackParamList, 'gemDetails'>>();
  const {gem} = props;
  const {isLoading, data: similarGems} = useSimilarGemsQuery({
    gemId: gem.id,
  });
  const {isLoading: likesIsLoading, data: likesCount} = useGemLikesQuery(
    gem.id,
  );

  const gemMapInfo = useMemo(() => {
    if (!gem?.map) {
      return null;
    }
    try {
      const map = JSON.parse(gem.map) as {
        formatted_address: string;
        lat: number;
        lng: number;
      } | null;

      return map;
    } catch (error) {
      return null;
    }
  }, [gem]);

  const goToMap = useCallback(async () => {
    if (!gemMapInfo) {
      return;
    }

    navigation.navigate('mapView', {
      markers: [
        {
          latitude: gemMapInfo.lat,
          longitude: gemMapInfo.lng,
          title: gem.name,
        },
      ],
      categoriesOfGems: [gem.gem_categories?.[0]?.id ?? 0],
      filledIcons: true,
      showNativeMapsButton: true,
    });
  }, [gem.gem_categories, gem.name, gemMapInfo, navigation]);

  const goToNativeMap = useCallback(async () => {
    if (!gemMapInfo) {
      return;
    }

    const scheme = Platform.select({ios: 'maps:0,0?q=', android: 'geo:0,0?q='});
    const latLng = `${gemMapInfo.lat},${gemMapInfo.lng}`;
    const url = `${scheme}${latLng}`;

    if (await Linking.canOpenURL(url)) {
      await Linking.openURL(url);
    }
  }, [gemMapInfo]);

  const hasBookingLink = useMemo(
    () =>
      gem.second_cta_url &&
      typeof gem.second_cta_url === 'string' &&
      gem.second_cta_url.length > 0
        ? true
        : false,
    [gem],
  );

  const hasVisitLink = useMemo(
    () =>
      gem.url && typeof gem.url === 'string' && gem.url.length > 0
        ? true
        : false,
    [gem],
  );

  const hasMapInfo = !!gemMapInfo;

  const openLink = useCallback(async (url: string) => {
    if (await Linking.canOpenURL(url)) {
      await Linking.openURL(url);
    }
  }, []);

  const onBookPress = useCallback(async () => {
    openLink(gem.second_cta_url);
  }, [gem, openLink]);

  const onVisitPress = useCallback(async () => {
    openLink(gem.url);
  }, [gem, openLink]);

  const renderSimilarGem: ListRenderItem<Gem> = ({item, index}) => {
    if (!item) {
      return (
        <GemCard
          key={index}
          isSkeleton
          size="small"
          style={styles.gemCard}
          gem={null}
        />
      );
    }
    return (
      <GemCard
        key={item.id}
        gem={item}
        isSkeleton={isLoading}
        size="small"
        onPress={() => {
          navigation.push('gemDetails', {gem: item, gemId: item.id});
        }}
        style={styles.gemCard}
      />
    );
  };

  const similarListData = isLoading ? new Array(5).fill(null) : similarGems;

  return (
    <View style={styles.container}>
      <View style={[styles.quoteContainer, styles.screenPadding]}>
        {!likesIsLoading && likesCount !== undefined && (
          <View style={styles.timesContainer}>
            <SVG.Gem stroke={colors.gray100} style={styles.gemIcon} />
            <Text style={styles.timesText}>
              {t(
                likesCount === 1
                  ? 'gem_detail.count_time_collected'
                  : 'gem_detail.count_times_collected',
                {count: likesCount},
              )}
            </Text>
          </View>
        )}
        {gem.description &&
          gem.description.length > 0 &&
          gem.description[0]?.description && (
            <RenderHTML
              source={{html: gem.description[0].description}}
              contentWidth={variables.dimensions.width}
              defaultTextProps={{style: styles.descriptionText}}
              tagsStyles={{
                p: {
                  ...styles.descriptionText,
                  marginTop: 0,
                },
              }}
            />
          )}
        {gem.description[0]?.user && (
          <View style={styles.userContainer}>
            {gem.description[0].user.profile_image && (
              <Image
                source={{
                  uri: `${AppConfig.IMAGE_URL}${gem.description[0].user.profile_image}`,
                  width: 24,
                  height: 24,
                }}
                style={styles.userImage}
              />
            )}
            <Text style={styles.userText}>
              {gem.description[0].user.display_name_single_line}
            </Text>
          </View>
        )}
      </View>
      <View style={[styles.actionsContainer, styles.screenMargin]}>
        <TouchableOpacity
          style={styles.actionButton}
          activeOpacity={0.7}
          onPress={onBookPress}
          disabled={!hasBookingLink}>
          <SVG.Book
            height={24}
            color={!hasBookingLink ? colors.gray50 : colors.black}
          />
          <Text
            style={[
              styles.actionButtonText,
              !hasBookingLink && styles.disabledText,
            ]}>
            {t('gem_detail.book')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          activeOpacity={0.7}
          onPress={onVisitPress}
          disabled={!hasVisitLink}>
          <SVG.Monitor
            height={24}
            color={!hasVisitLink ? colors.gray50 : colors.black}
          />
          <Text
            style={[
              styles.actionButtonText,
              !hasVisitLink && styles.disabledText,
            ]}>
            {t('gem_detail.website')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          activeOpacity={0.7}
          onPress={goToNativeMap}
          disabled={!hasMapInfo}>
          <SVG.MapMarker
            height={24}
            color={!hasMapInfo ? colors.gray50 : colors.black}
          />
          <Text
            style={[
              styles.actionButtonText,
              !hasMapInfo && styles.disabledText,
            ]}>
            {t('gem_detail.map')}
          </Text>
        </TouchableOpacity>
      </View>
      {hasMapInfo && (
        <>
          <Text style={[styles.sectionTitle, styles.screenMargin]}>
            {t('gem_detail.map')}
          </Text>
          <MapImage
            style={[styles.map, styles.screenMargin]}
            markers={[
              {
                latitude: gemMapInfo.lat,
                longitude: gemMapInfo.lng,
                gemCategoryId: gem.gem_categories?.[0]?.id,
                filled: true,
              },
            ]}
            mapHeight={190}
            mapWidth={Math.trunc(variables.dimensions.width - 32)}
            zoom={13}
            imageStyle={styles.mapImage}
            onPress={goToMap}
          />
        </>
      )}
      <Text style={[styles.sectionTitle, styles.screenMargin]}>
        {`${t('gem_detail.similar_gems_in')}${gem.location?.name}`}
      </Text>
      <FlatList
        data={similarListData}
        renderItem={renderSimilarGem}
        horizontal={true}
        contentContainerStyle={styles.screenPadding}
        style={styles.similarList}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopRightRadius: 24,
    borderTopLeftRadius: 24,
    paddingBottom: 66,
    zIndex: 100,
  },
  screenMargin: {
    marginHorizontal: 16,
  },
  screenPadding: {
    paddingHorizontal: 16,
  },
  quoteContainer: {},
  timesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gemIcon: {
    marginRight: 4,
  },
  timesText: {
    ...typography.smallParagraph,
    color: colors.gray100,
  },
  descriptionText: {
    ...typography.h4,
    marginTop: 16,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  userImage: {
    width: 24,
    height: 24,
    borderRadius: 24 / 2,
    marginRight: 8,
  },
  userText: {
    ...typography.caption,
    color: colors.gray100,
  },
  actionsContainer: {
    marginTop: 8,
    backgroundColor: colors.gray10,
    borderRadius: 10,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    // alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    // borderWidth: 1,
  },
  actionButtonText: {
    ...typography.caption,
    marginTop: 6,
  },
  disabledText: {
    color: colors.gray50,
  },
  sectionTitle: {
    ...typography.h3,
    marginTop: 32,
    marginBottom: 16,
  },
  map: {
    height: 190,
    marginBottom: 8,
  },
  mapImage: {
    borderRadius: 16,
  },
  gemCard: {
    marginRight: 8,
  },
  similarList: {
    marginBottom: 24,
  },
});

export default GemContent;
