import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, ImageBackground, Image} from 'react-native';

import {CollapsingHeader} from '@/Commons';
import {StackScreenProps} from '@react-navigation/stack';
import {StackParamList} from '@/Navigators/Stacks';
import {colors, typography, variables} from '@/Theme';
import {StoryContent, StoryHeader} from '../Components';
import {AppConfig} from '@/Config';
import LinearGradient from 'react-native-linear-gradient';
import {useStoryByIdQuery} from '@/Services/modules/stories';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const StoryDetails: React.FC<
  StackScreenProps<StackParamList, 'storyDetails'>
> = ({
  route: {
    params: {story},
  },
  navigation,
}) => {
  const [storyDetails, setStoryDetails] = useState(story);
  const insets = useSafeAreaInsets();

  const {data: storyData, isSuccess: storyIsSuccess} = useStoryByIdQuery(
    story.id,
  );

  useEffect(() => {
    if (storyIsSuccess && storyData) {
      setStoryDetails(storyData);
    }
  }, [storyIsSuccess, storyData]);

  // const onSharePress = useCallback(() => {
  //   if (storyDetails?.web_address) {
  //     if (Platform.OS === 'android') {
  //       Share.share({message: storyDetails.web_address});
  //     } else {
  //       Share.share({url: storyDetails.web_address});
  //     }
  //   }
  // }, [storyDetails]);

  return (
    <>
      <View style={styles.container}>
        <CollapsingHeader
          MinHeight={50 + insets.top}
          MaxHeight={variables.dimensions.height * 0.6}
          MaxContent={
            <ImageBackground
              resizeMode="cover"
              style={styles.portraitImageStyle}
              source={{
                uri: `${AppConfig.IMAGE_URL}${storyDetails.tile_image}`,
              }}>
              <View style={styles.textWrapper}>
                <Text style={styles.titleText}>{storyDetails.title}</Text>
                {storyDetails.user_details && (
                  <View style={styles.userContainer}>
                    <Image
                      resizeMode="cover"
                      style={styles.userImage}
                      source={{
                        uri: `${AppConfig.IMAGE_URL}${storyDetails.user_details.profile_image}`,
                      }}
                    />
                    <View style={styles.userNameContainer}>
                      <Text style={styles.subTitleText}>
                        {storyDetails.user_details.first_name}
                      </Text>
                      <Text style={[styles.subTitleText, styles.textUppercase]}>
                        {storyDetails.user_details.last_name}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
              <View style={styles.borderSectionOnImage} />
              <LinearGradient
                colors={['#00000000', '#000000FF']}
                style={styles.gradient}
              />
            </ImageBackground>
          }
          MinContent={
            <View
              style={[styles.headerBackGround, {height: 50 + insets.top}]}
            />
          }
          FixedContent={
            <StoryHeader
              navigation={navigation}
              rightButtonVariant="none"
              // onRightButtonPress={onSharePress}
            />
          }>
          <StoryContent contentBlocks={storyDetails.content_blocks} />
        </CollapsingHeader>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  portraitImageStyle: {
    width: variables.dimensions.width,
    height: variables.dimensions.height * 0.6,
    zIndex: -10,
  },
  headerBackGround: {
    width: variables.dimensions.width,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  userContainer: {
    flexDirection: 'row',
    marginTop: 8,
    alignItems: 'center',
  },
  userImage: {
    width: 30,
    height: 30,
    borderRadius: 100,
  },
  userNameContainer: {
    marginLeft: 10,
  },
  gradient: {
    height: '50%',
    width: '100%',
    bottom: 0,
    borderRadius: 9,
    position: 'absolute',
    zIndex: 99,
  },
  textWrapper: {
    position: 'absolute',
    bottom: 50,
    width: variables.dimensions.width * 0.9,
    alignSelf: 'center',
    zIndex: 1200,
  },
  titleText: {
    ...typography.h1,
    color: colors.white,
  },
  subTitleText: {
    ...typography.caption,
    color: colors.white,
  },
  textUppercase: {
    textTransform: 'uppercase',
  },
  borderSectionOnImage: {
    width: variables.dimensions.width,
    height: 32,
    backgroundColor: colors.white,
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    zIndex: 100,
  },
});

export default StoryDetails;
