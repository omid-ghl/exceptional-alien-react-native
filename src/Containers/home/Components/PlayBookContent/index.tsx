import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Linking} from 'react-native';
import {useTranslation} from 'react-i18next';
import {colors, SVG, typography, variables} from '@/Theme';
import {IPlayBookContent} from './PlayBookContent';
import {GemCard, MapImage} from '@/Commons';
import {useNavigation} from '@react-navigation/native';
import {StackParamList} from '@/Navigators/Stacks';
import {StackNavigationProp} from '@react-navigation/stack';
import {Gem} from '@/Models';
import {AppConfig} from '@/Config';
import {PodcastPlayer} from '@/Commons/PodcastPlayer';
import RenderHTML from 'react-native-render-html';
import {LatLng} from 'react-native-maps';
import {useVideoPrefetch} from '@/Services';
import FastImage from 'react-native-fast-image';

const PlayBookContent = (props: IPlayBookContent.IProps) => {
  const {t} = useTranslation();
  const navigation =
    useNavigation<StackNavigationProp<StackParamList, 'playBookDetails'>>();
  const {playBook} = props;
  const [expanded, setExpanded] = useState(false);

  const prefetchVideo = useVideoPrefetch('videoById');

  useEffect(() => {
    if (playBook?.video_id) {
      prefetchVideo(playBook.video_id);
    }
  }, [playBook, prefetchVideo]);

  const gems = useMemo(() => {
    if (!playBook?.gems) {
      return null;
    }
    return playBook.gems.slice(0, 5); // According to https://app.clickup.com/t/3f20x5r we should only show first 5 gems
  }, [playBook]);

  const gemLocations:
    | (LatLng & {
        title?: string;
        description?: string;
        gemCategoryId?: number;
        filled?: boolean;
      })[]
    | null = useMemo(() => {
    if (!gems) {
      return null;
    }
    try {
      const locs: (LatLng & {
        title?: string;
        description?: string;
        gemCategoryId?: number;
        filled?: boolean;
      })[] = [];
      for (const g of gems) {
        try {
          if (!g?.map) {
            continue;
          }
          const map = JSON.parse(g.map) as {
            formatted_address: string;
            lat: number;
            lng: number;
          } | null;

          if (map) {
            locs.push({
              latitude: map.lat,
              longitude: map.lng,
              title: g.name,
              gemCategoryId: g.gem_categories?.[0]?.id,
              filled: false,
            });
          }
        } catch (error) {}
      }

      return locs.length > 0 ? locs : null;
    } catch (error) {
      return null;
    }
  }, [gems]);

  const goToMap = useCallback(() => {
    let categoriesOfGems: (number | undefined)[] = [];
    if (!gemLocations) {
      return;
    }
    playBook?.gems?.forEach(element => {
      categoriesOfGems.push(element.gem_categories[0].id);
    });
    navigation.navigate('mapView', {
      markers: gemLocations,
      categoriesOfGems,
    });
  }, [gemLocations, navigation]);

  const renderGems = (item: Gem, index: number) => {
    if (!item) {
      return (
        <GemCard key={index} isSkeleton style={styles.gemCard} gem={null} />
      );
    }

    item.location = playBook.location;

    return (
      <GemCard
        key={item.id}
        gem={item}
        onPress={() => {
          navigation.push('gemDetails', {gem: item, gemId: item.id});
        }}
        style={styles.gemCard}
      />
    );
  };

  const socialUrl = useMemo(() => {
    const playBookUser = playBook.user;
    if (!playBookUser) {
      return null;
    }

    return (
      playBookUser.social_instagram ??
      playBookUser.social_twitter ??
      playBookUser.social_facebook ??
      playBookUser.social_linkedin ??
      null
    );
  }, [playBook.user]);

  const goToLink = useCallback(async (url: string | null) => {
    if (!url) {
      return;
    }
    if (await Linking.canOpenURL(url)) {
      Linking.openURL(url);
    }
  }, []);

  const goToVideo = useCallback(() => {
    if (!playBook?.video_id) {
      return;
    }
    navigation.navigate('videoView', {
      title: playBook.title,
      videoId: playBook.video_id,
      posterUrl: playBook?.user?.profile_image
        ? `${AppConfig.IMAGE_URL}${playBook.user.profile_image}`
        : undefined,
    });
  }, [navigation, playBook]);

  const toggleAbout = useCallback(() => {
    setExpanded(prev => !prev);
  }, []);

  return (
    <View style={styles.container}>
      <View style={[styles.quoteContainer, styles.screenPadding]}>
        <Text style={styles.timesText}>
          {t('about_user', {user: playBook?.user?.first_name})}
        </Text>

        <Text style={styles.descriptionText}>
          {playBook.user?.seo_description}
        </Text>
        {expanded && playBook.user?.about && (
          <RenderHTML
            source={{html: playBook.user.about}}
            contentWidth={variables.dimensions.width}
            defaultTextProps={{style: styles.aboutText}}
          />
        )}

        {/*  based on this ticket --> https://app.clickup.com/t/860pk70cr
       {expanded && (
          <View style={styles.socialContainer}>
            {socialUrl && (
              <Link
                text={t('social')}
                style={styles.socialLink}
                onPress={() => goToLink(socialUrl)}
                textStyle={styles.socialLinkText}
              />
            )}
            {playBook.user?.social_website && (
              <Link
                text={t('website')}
                onPress={() =>
                  goToLink(playBook.user?.social_website as string)
                }
                style={styles.websiteLink}
                textStyle={styles.websiteLinkText}
              />
            )}
          </View>
        )} */}
        <TouchableOpacity
          onPress={toggleAbout}
          style={styles.readMoreTouchable}>
          <Text style={styles.readMoreText}>
            {t(expanded ? 'read_less' : 'read_more')}
          </Text>
        </TouchableOpacity>
      </View>

      {playBook.podcast?.m3u8_url && <PodcastPlayer playBook={playBook} />}

      {playBook?.video_id && (
        <TouchableOpacity
          onPress={goToVideo}
          activeOpacity={0.7}
          style={[styles.provieVideoContainer, styles.screenMargin]}>
          <FastImage
            source={{
              uri: `${AppConfig.IMAGE_URL}${playBook.location?.feature_image}`,
            }}
            resizeMode="cover"
            style={[styles.videoImage]}
          />
          <View style={styles.backdrop}>
            <View style={styles.makeVideoWrapper}>
              <Text style={styles.videoTitleText}>{t('watch')}</Text>
              <Text style={styles.fullNameText}>{playBook?.title}</Text>
            </View>
            <View style={styles.videoButton}>
              <SVG.Video />
            </View>
          </View>
        </TouchableOpacity>
      )}
      {gems && (
        <>
          <Text style={[styles.sectionTitle, styles.screenMargin]}>
            {t('count_gems_in_this_playbook', {count: gems.length})}
          </Text>
          <View style={styles.similarList}>{gems.map(renderGems)}</View>
        </>
      )}
      <Text style={[styles.sectionTitle, styles.screenMargin]}>
        {t('gem_detail.map')}
      </Text>
      {gemLocations && (
        <MapImage
          style={[styles.map, styles.screenMargin]}
          markers={gemLocations}
          mapHeight={190}
          mapWidth={Math.trunc(variables.dimensions.width - 32)}
          zoom={14}
          imageStyle={styles.mapImage}
          onPress={goToMap}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderTopRightRadius: 24,
    borderTopLeftRadius: 24,
    paddingBottom: 50,
    zIndex: 100,
  },
  screenMargin: {
    marginHorizontal: 16,
  },
  screenPadding: {
    paddingHorizontal: 16,
  },
  quoteContainer: {
    minHeight: 100,
  },
  timesText: {
    ...typography.smallParagraph,
    color: colors.gray100,
  },
  descriptionText: {
    ...typography.h4,
    marginTop: 8,
  },
  aboutText: {
    ...typography.largeParagraph,
  },
  readMoreText: {
    ...typography.caption,
    color: colors.gray100,
  },
  readMoreTouchable: {
    paddingTop: 8,
    paddingBottom: 16,
    paddingRight: 32,
    alignSelf: 'flex-start',
  },
  socialContainer: {
    flexDirection: 'row',
  },
  socialLink: {
    paddingLeft: 0,
    paddingRight: 8,
    paddingVertical: 8,
    marginTop: 8,
  },
  socialLinkText: {
    color: colors.primary,
  },
  websiteLink: {
    marginTop: 8,
    paddingVertical: 8,
  },
  websiteLinkText: {
    color: colors.primary,
  },
  provieVideoContainer: {
    marginTop: 8,
    borderRadius: 9,
    height: 72,
  },

  sectionTitle: {
    ...typography.h3,
    marginTop: 32,
    marginBottom: 16,
  },
  map: {
    height: 190,
    borderRadius: 16,
    marginBottom: 36,
  },
  gemCard: {
    marginBottom: 8,
    alignSelf: 'center',
  },
  similarList: {},
  videoButton: {
    width: 40,
    height: 40,
    borderRadius: 40,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 9,
  },

  mapImage: {
    borderRadius: 16,
  },
  backgroundImageStyle: {
    borderRadius: 10,
  },
  backdrop: {
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: 9,
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  makeVideoWrapper: {width: '85%'},
  videoTitleText: {
    ...typography.caption,
    color: colors.white,
  },
  fullNameText: {
    ...typography.h4,
    color: colors.white,
  },
});

export default PlayBookContent;
