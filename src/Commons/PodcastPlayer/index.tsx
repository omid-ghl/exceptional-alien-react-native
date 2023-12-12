import {AppConfig} from '@/Config';
import {PlayBook} from '@/Models/PlayBook';
import {colors, SVG, typography} from '@/Theme';
import moment from 'moment';
import React, {useCallback, useMemo, useRef, useState} from 'react';
import MarqueeText from 'react-native-marquee';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Video, {
  OnBufferData,
  OnLoadData,
  OnPlaybackRateData,
  OnProgressData,
  OnSeekData,
} from 'react-native-video';
import {useFocusEffect} from '@react-navigation/native';
import VideoSlider from '../VideoSlider';

const PodcastPlayer = ({playBook}: {playBook: PlayBook}) => {
  const podcastURL = useMemo(
    () => encodeURI(playBook.podcast?.m3u8_url ?? ''),
    [playBook],
  );

  const videoRef = useRef<Video>(null);
  const [paused, setPaused] = useState(true);
  const [startedPlaying, setStartedPlaying] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [position, setPosition] = useState(0);
  const [totalDuration, setTotalDuration] = useState<number | null>(null);
  const [, setRate] = useState(0);

  const togglePause = useCallback(() => {
    if (paused) {
      setStartedPlaying(true);
    }
    setPaused(p => !p);
  }, [paused]);

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
    videoRef.current?.seek(0);
	setPaused(true)
  }, []);

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


  const renderPlayButton = useMemo(() => {
    if(buffering) return <ActivityIndicator size={40} color={colors.white} />;

    if(!paused) return <SVG.Pause />;

    return <SVG.Play style={styles.marginLeft5} />;
  }, [buffering, paused, colors]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        setPaused(true);
      };
    }, []),
  );

  if (!playBook.podcast) {
    return null;
  }

  return (
    <View style={[styles.playerContainer, styles.screenMargin]}>
      <FastImage
        source={{
          uri: playBook.user?.profile_image
            ? `${AppConfig.IMAGE_URL}${playBook.user.profile_image}`
            : undefined,
        }}
        style={styles.userImage}
        resizeMode="cover"
      />
      <Video
        source={{
          uri: podcastURL,
        }}
        ref={videoRef}
        audioOnly={true}
        style={styles.video}
        paused={paused}
        poster={''}
        posterResizeMode="cover"
        ignoreSilentSwitch="ignore"
        onBuffer={onBuffer}
        onLoadStart={onLoadStart}
        onLoad={onLoad}
        progressUpdateInterval={500}
        onProgress={onProgress}
        onSeek={onSeek}
        onEnd={onEnd}
        onPlaybackRateChange={onPlaybackRateChange}
      />
      <View style={styles.podcastTextWrapper}>
        <Text style={styles.podcastName}>{playBook.podcast.name}</Text>
        <MarqueeText
          style={styles.podcastTitle}
          delay={1000}
          speed={0.3}
          loop={true}>
          {playBook.title}
        </MarqueeText>
        <View style={styles.progressbarWrapper}>
          <VideoSlider
            style={styles.slider}
            value={position}
            minimumValue={0}
            maximumValue={totalDuration ?? 100}
            onSlidingComplete={onSliding}
            maximumColor={colors.gray50}
          />
          {(progressText || durationText) && (
            <Text style={styles.progress}>
              {startedPlaying ? progressText : durationText}
            </Text>
          )}
        </View>
      </View>

      <TouchableOpacity
        disabled={buffering}
        onPress={togglePause}
        style={styles.playButton}>
        {renderPlayButton}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  playerContainer: {
    marginTop: 18,
    backgroundColor: colors.gray10,
    borderRadius: 9,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  provieVideoContainer: {
    marginTop: 8,
    backgroundColor: colors.gray10,
    borderRadius: 10,
    height: 72,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
  },

  sectionTitle: {
    ...typography.h3,
    marginTop: 32,
    marginBottom: 16,
  },
  map: {
    height: 190,
    borderRadius: 16,
    marginBottom: 8,
  },
  gemCard: {
    marginRight: 8,
  },
  similarList: {
    marginBottom: 24,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 40,
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },
  videoButton: {
    width: 40,
    height: 40,
    borderRadius: 40,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  video: {
    display: 'none',
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  podcastTextWrapper: {
    flex: 1,
    marginHorizontal: 12,
  },
  podcastName: {
    ...typography.h5,
  },
  podcastTitle: {
    ...typography.caption,
    color: colors.gray100,
  },
  progress: {
    ...typography.caption,
    color: colors.gray100,
    // marginLeft: 8,
    textAlign: 'right',
    minWidth: 30,
  },
  progressbarWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressbar: {
    flex: 1,
    height: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderRadius: 7.0,
    backgroundColor: '#C4C4C4',
    borderColor: 'transparent',
  },
  slider: {
    flex: 1,
    height: 10,
    marginVertical: 5,
    overflow: "hidden",
    borderRadius: 7,
  },
  marginLeft5: {marginLeft: 5},
  screenMargin: {
    marginHorizontal: 16,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 40,
    backgroundColor: colors.gray50,
    marginLeft: 15,
  },
});

export {PodcastPlayer};
