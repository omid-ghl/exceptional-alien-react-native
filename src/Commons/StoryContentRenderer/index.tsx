import React, {FC} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import RenderHTML from 'react-native-render-html';

import {colors, typography, variables} from '@/Theme';
import Variables from '@/Theme/Variables';
import {IStoryContentRenderer} from './StoryContentRenderer';

const StoryContentRenderer = (props: IStoryContentRenderer.IProps) => {
  const {attributes, layout, titleStyle} = props;

  const author = () => {
    return <Text>{attributes.copy}</Text>;
  };

  const interview_intro = () => {
    return (
      <RenderHTML
        source={{html: attributes.pull_quote + attributes.feature_copy}}
        contentWidth={variables.dimensions.width}
        tagsStyles={{
          p: styles.pTagStyle,
        }}
      />
    );
  };

  const h2_block = () => {
    return (
      <Text style={[styles.h2, titleStyle]}>{attributes.heading_copy}</Text>
    );
  };

  const h3_block = () => {
    return <Text style={styles.h3}>{attributes.heading_copy}</Text>;
  };

  const text_block = () => {
    const html = attributes?.copy?.replace('<br>', '');
    return (
      <RenderHTML
        source={{html}}
        contentWidth={variables.dimensions.width}
        defaultTextProps={{}}
        tagsStyles={{p: {color: colors.grayBack}}}
      />
    );
  };

  const full_width_image = () => {
    return (
      <>
        <Image
          source={{
            uri:
              (attributes.image_url && attributes.image_url.length > 0) ||
              attributes.image
                ? attributes.image ?? attributes.image_url
                : 'https://via.placeholder.com/240',
          }}
          style={styles.fullWidthImageStyle}
        />
        <Text>{attributes.caption}</Text>
      </>
    );
  };

  const caption = () => {
    return <Text>{attributes.copy}</Text>;
  };

  const pull_quote = () => {
    return <Text style={styles.pullQuoteStyle}>{attributes?.quote}</Text>;
  };
  const single_image = () => {
    return (
      <>
        <Image
          source={{
            uri:
              (attributes.image_url && attributes.image_url.length > 0) ||
              attributes.image
                ? attributes.image ?? attributes.image_url
                : 'https://via.placeholder.com/240',
          }}
          style={styles.fullWidthImageStyle}
        />
        <Text>{attributes.caption}</Text>
      </>
    );
  };

  const gem = () => {
    return <></>;
  };

  const Video = () => {
    return <Text>Video</Text>;
  };
  const vimeo_video = () => {
    return <Text>vimeo_video</Text>;
  };
  const infocus_slider = () => {
    return <Text>infocus_slider</Text>;
  };
  const full_width_image_slider_parallax = () => {
    return <Text>full_width_image_slider_parallax</Text>;
  };

  const image_left_right = () => {
    return <Text>image_left_right</Text>;
  };

  const SECTION = {
    author,
    interview_intro,
    h2_block,
    h3_block,
    text_block,
    full_width_image,
    caption,
    pull_quote,
    single_image,
    gem,
    Video,
    vimeo_video,
    infocus_slider,
    full_width_image_slider_parallax,
    image_left_right,
  };

  let Component: FC = SECTION[layout as keyof typeof SECTION];

  return <View style={styles.wrapperStyle}>{Component && <Component />}</View>;
};

export default StoryContentRenderer;

const styles = StyleSheet.create({
  wrapperStyle: {
    marginVertical: 10,
  },
  pullQuoteStyle: {
    ...typography.pullQuote,
  },
  h2: {
    ...typography.h3,
  },
  h3: {
    ...typography.h4,
  },
  fullWidthImageStyle: {
    width: Variables.dimensions.width * 0.9,
    height: 240,
    borderRadius: 15,
    alignSelf: 'center',
  },
  card: {
    alignSelf: 'center',
  },
  pTagStyle: {
    ...typography.h3,
    color: colors.primary,
    width: variables.dimensions.width - 32,
    fontWeight: 'bold',
  },
});
