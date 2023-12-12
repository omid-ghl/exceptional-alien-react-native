import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ListRenderItem,
  ActivityIndicator,
} from 'react-native';

import {StackScreenProps} from '@react-navigation/stack';
import {StackParamList} from '@/Navigators/Stacks';
import {colors, typography, variables} from '@/Theme';
import {usePrivacyAndPolicyQuery} from '@/Services';
import {ContentBlocks} from '@/Models';
import TagRenderer from '@/Commons/StoryContentRenderer';

const About: React.FC<StackScreenProps<StackParamList, 'about'>> = ({}) => {
  const {data, isLoading, isFetching} = usePrivacyAndPolicyQuery({});

  const privaciesData = data?.data?.data;

  const renderContentBlocks: ListRenderItem<ContentBlocks> = ({item}) => {
    return (
      <TagRenderer
        titleStyle={styles.tagComponent}
        attributes={item?.attributes}
        layout={item?.layout}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.safeArea}>
        {isFetching || isLoading ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            data={privaciesData?.content_blocks}
            renderItem={renderContentBlocks}
            contentContainerStyle={styles.flatListContainerStyle}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...typography.h1,
    marginTop: 43,
  },
  titleDesc: {
    ...typography.h3,
    color: colors.primary,
    marginTop: 24,
  },
  mainTitle: {
    ...typography.h3,
    marginTop: 32,
  },
  subTitle: {
    ...typography.h5,
    marginTop: 22,
  },
  description: {
    ...typography.smallParagraph,
    marginTop: 22,
  },
  flatListContainerStyle: {maxWidth: variables.dimensions.width - 32},
  tagComponent: {marginBottom: -50},
});

export default About;
