import React, {
  ComponentProps,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
  Text,
} from 'react-native';

import {StackScreenProps} from '@react-navigation/stack';
import {StackParamList} from '@/Navigators/Stacks';
import {colors, SVG, typography, variables} from '@/Theme';
import {VideoHeader} from '../Components';
import Video, {
  OnBufferData,
  OnLoadData,
  OnPlaybackRateData,
  OnProgressData,
  OnSeekData,
} from 'react-native-video';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';
import MarqueeText from 'react-native-marquee';
import moment from 'moment';
import {useVideoByIdQuery} from '@/Services';
import FastImage from 'react-native-fast-image';
import {useFocusEffect} from '@react-navigation/native';
import {VideoSlider} from '@/Commons';

const DOUBLE_TAP_DELAY = 200;

const VideoView: React.FC<StackScreenProps<StackParamList, 'videoView'>> = ({
  navigation,
  route: {
    params: {title, videoId, posterUrl},
  },
}) => {
  const videoRef = useRef<Video>(null);
  const [videoFocus, setVideoFocus] = useState(false);
  const [paused, setPaused] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [position, setPosition] = useState(0);
  const [totalDuration, setTotalDuration] = useState<number | null>(null);
  const [, setRate] = useState(0);
  const [resizeMode, setResizeMode] =
    useState<ComponentProps<typeof Video>['resizeMode']>('cover');
  const firstTap = useRef<boolean>(true);
  const lastTapTs = useRef<number>(new Date().getTime());
  const tapTimeout = useRef<NodeJS.Timeout | null>(null);

  const {data: videoData, isLoading, isSuccess} = useVideoByIdQuery(videoId);

  const videoUrl = useMemo(
    () =>
      isSuccess && videoData
        ? videoData.cloudflare_hls_manifest_url &&
          videoData.cloudflare_hls_manifest_url.length > 0
          ? videoData.cloudflare_hls_manifest_url
          : videoData.cloudflare_download_url &&
            videoData.cloudflare_download_url.length > 0
          ? videoData.cloudflare_download_url
          : null
        : null,
    [isSuccess, videoData],
  );

  const toggleFocus = useCallback(() => {
    setVideoFocus(p => !p);
  }, []);

  const toggleResizeMode = useCallback(() => {
    setResizeMode(r => (r === 'cover' ? 'contain' : 'cover'));
  }, []);

  const handleTap = useCallback(() => {
    const now = new Date().getTime();
    if (firstTap.current) {
      firstTap.current = false;

      tapTimeout.current = setTimeout(() => {
        toggleFocus();
        firstTap.current = true;
        tapTimeout.current = null;
      }, DOUBLE_TAP_DELAY);

      lastTapTs.current = now;
    } else if (now - lastTapTs.current < DOUBLE_TAP_DELAY) {
      if (tapTimeout.current) {
        clearTimeout(tapTimeout.current);
        tapTimeout.current = null;
      }
      toggleResizeMode();
      firstTap.current = true;
    }
  }, [toggleFocus, toggleResizeMode]);

  const seek15sBackward = useCallback(() => {
    videoRef.current?.seek(Math.max(position - 15, 0));
  }, [position]);

  const seek15sForward = useCallback(() => {
    if (totalDuration === null) {
      return;
    }
    videoRef.current?.seek(Math.min(position + 15, totalDuration));
  }, [position, totalDuration]);

  const togglePause = useCallback(() => {
    setPaused(p => !p);
  }, []);

  const onBuffer = useCallback((data: OnBufferData) => {
    setBuffering(data.isBuffering);
  }, []);

  const onLoadStart = useCallback(() => {
    setBuffering(true);
  }, []);
  const onLoad = useCallback((data: OnLoadData) => {
    setBuffering(false);
    setTotalDuration(data.duration);
    setPosition(data.currentPosition);
  }, []);

  const onProgress = useCallback((data: OnProgressData) => {
    setPosition(data.currentTime);
  }, []);

  const onSeek = useCallback((data: OnSeekData) => {
    setPosition(data.currentTime);
  }, []);

  const onSliding = useCallback((value: number) => {
    videoRef.current?.seek(value);
  }, []);

  const onPlaybackRateChange = useCallback((data: OnPlaybackRateData) => {
    if (!data) {
      return;
    }
    const {playbackRate} = data;
    setRate(playbackRate);
  }, []);

  const onEnd = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onBackPress = useCallback(() => {
    setPaused(true);
    navigation.goBack();
  }, [navigation]);

  const progressText = useMemo(() => {
    if (!position) {
      return '0:00';
    }
    return moment.utc(position * 1000).format('m:ss');
  }, [position]);

  const durationText = useMemo(() => {
    if (!totalDuration) {
      return '0:00';
    }
    return moment.utc(totalDuration * 1000).format('m:ss');
  }, [totalDuration]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        setPaused(true);
      };
    }, []),
  );

  return (
    <View style={styles.container}>
      {isLoading ? (
        <FastImage
          resizeMode="cover"
          source={{uri: posterUrl}}
          style={styles.video}
        />
      ) : (
        <Video
          // source={{
          //   //   uri: 'https://cdn.api.video/vod/vi69DkCVd1t2JNddtWKZcQfA/mp4/source.mp4',
          //   //   uri: 'https://vod-progressive.akamaized.net/exp=1669301241~acl=%2Fvimeo-prod-skyfire-std-us%2F01%2F3408%2F15%2F392040372%2F1660599182.mp4~hmac=8f0b63e8db5ab6c1a62ec341f23e941a5657b88a3dc022eea18ef2ada7db0fbc/vimeo-prod-skyfire-std-us/01/3408/15/392040372/1660599182.mp4?download=1&filename=production+ID%3A3756003.mp4',
          //   // uri: 'https://vod-progressive.akamaized.net/exp=1669304361~acl=%2Fvimeo-prod-skyfire-std-us%2F01%2F4046%2F16%2F420234383%2F1814649193.mp4~hmac=5512a7c12ebde4322e1290fb8b410835fe47e61e7476f98770e844f0da2c8d71/vimeo-prod-skyfire-std-us/01/4046/16/420234383/1814649193.mp4?download=1&filename=production+ID%3A4434136.mp4',
          //   uri: '',
          // }}
          source={{
            uri: videoUrl ?? '',
          }}
          ref={videoRef}
          style={styles.video}
          paused={paused}
          poster={posterUrl}
          posterResizeMode="cover"
          onBuffer={onBuffer}
          ignoreSilentSwitch="ignore"
          onLoadStart={onLoadStart}
          onLoad={onLoad}
          progressUpdateInterval={500}
          onProgress={onProgress}
          onSeek={onSeek}
          resizeMode={resizeMode}
          onEnd={onEnd}
          onPlaybackRateChange={onPlaybackRateChange}
        />
      )}

      <Pressable onPress={handleTap} style={styles.touchableOverlay}>
        {!videoFocus && (
          <Animated.View
            style={styles.overlay}
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(300)}>
            <VideoHeader onBackPress={onBackPress} />
            <LinearGradient
              colors={['#00000000', '#000000FF']}
              style={styles.gradient}
              pointerEvents="none"
            />
            <View style={styles.controlsContainer}>
              <MarqueeText
                style={styles.title}
                delay={1000}
                speed={0.5}
                loop={true}>
                {title}
              </MarqueeText>
              <VideoSlider
                style={styles.slider}
                value={position}
                minimumValue={0}
                maximumValue={totalDuration ?? 100}
                onSlidingComplete={onSliding}
                maximumTrackTintColor={colors.gray30}
              />
              <View style={styles.durationContainer}>
                <Text style={styles.durationText}>{progressText}</Text>
                <Text style={styles.durationText}>{durationText}</Text>
              </View>
              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={styles.backwardButton}
                  onPress={seek15sBackward}>
                  <SVG.Media15sBack />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.pauseButton}
                  onPress={togglePause}>
                  {buffering ? (
                    <View style={styles.button}>
                      <ActivityIndicator color={colors.black} size="small" />
                    </View>
                  ) : !paused ? (
                    <SVG.MediaPause />
                  ) : (
                    <SVG.MediaPlay />
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.forwardButton}
                  onPress={seek15sForward}>
                  <SVG.Media15sSkip />
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  video: {
    flex: 1,
  },
  touchableOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  back: {
    position: 'absolute',
    bottom: 0,
    width: variables.dimensions.width * 0.9,
    alignSelf: 'center',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '50%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  controlsContainer: {
    flexDirection: 'column',
    marginBottom: 90,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  durationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginHorizontal: 16,
    marginTop: -10,
  },
  durationText: {
    ...typography.caption,
    color: colors.gray50,
  },
  backwardButton: {
    marginRight: 32,
  },
  pauseButton: {},
  forwardButton: {
    marginLeft: 32,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slider: {
    alignSelf: 'stretch',
    marginHorizontal: 16,
  },
  title: {
    ...typography.h2,
    marginHorizontal: 16,
    color: colors.white,
    marginBottom: 8,
  },
});

export default VideoView;
