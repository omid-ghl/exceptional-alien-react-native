import React from 'react';
import {StyleSheet, View, Text, ListRenderItem, FlatList} from 'react-native';
import {useTranslation} from 'react-i18next';
import {colors, typography, variables} from '@/Theme';
import {IPartnershipContent} from './PartnershipContent';
import {PartnershipStoryCard, PlaybookCard} from '@/Commons';
import {useNavigation} from '@react-navigation/native';
import {StackParamList} from '@/Navigators/Stacks';
import {StackNavigationProp} from '@react-navigation/stack';
import {PartnershipStory, PlayBook} from '@/Models';
import RenderHTML from 'react-native-render-html';
import DynamicFlatlist from '@/Commons/DynamicFlatlist';
// import { useLatestStoriesQuery } from '@/Services';

const PartnershipContent = (props: IPartnershipContent.IProps) => {
  const {t} = useTranslation();
  const navigation =
    useNavigation<StackNavigationProp<StackParamList, 'partnershipDetails'>>();
  const {partnership} = props;

  // const {data: stories} = useLatestStoriesQuery(1);

  const renderPlaybooks: ListRenderItem<PlayBook> = ({index, item}) => {
    if (!item) {
      return (
        <PlaybookCard
          key={index}
          isSkeleton
          style={styles.playbookCard}
          playbook={null}
        />
      );
    }

    return (
      <PlaybookCard
        key={item.id}
        playbook={item}
        onPress={() => {
          navigation.push('playBookDetails', {
            playBook: item,
            playBookId: item.id,
          });
        }}
        style={styles.playbookCard}
      />
    );
  };

  const renderStories: ListRenderItem<PartnershipStory> = ({item, index}) => {
    if (!item) {
      return (
        <PartnershipStoryCard
          key={index}
          isSkeleton
          size="small"
          style={styles.storyCard}
          partnershipStory={null}
        />
      );
    }
    return (
      <PartnershipStoryCard
        key={item.id}
        partnershipStory={item}
        size="small"
        onPress={() => {
          navigation.push('partnershipStoryDetails', {
            partnershipStory: item,
            partnershipStoryId: item.id,
          });
        }}
        style={styles.storyCard}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.quoteContainer, styles.screenPadding]}>
        <Text style={styles.timesText}>{t('about')}</Text>
        <RenderHTML
          source={{
            html: partnership.about_partner,
          }}
          contentWidth={variables.dimensions.width}
          defaultTextProps={{style: styles.descriptionText}}
        />
      </View>

      {partnership?.playbooks && partnership.playbooks.length > 0 && (
        <>
          <Text style={[styles.sectionTitle, styles.screenMargin]}>
            {t('travel_playbooks')}
          </Text>
          <DynamicFlatlist
            swipable
            isLoading={false}
            isFetching={false}
            hasEnded={true}
            data={partnership.playbooks}
            keyExtractor={(item: PlayBook) => item.id.toString()}
            renderItem={renderPlaybooks}
            style={styles.list}
            contentContainerStyle={styles.listContentContainer}
          />
        </>
      )}

      {partnership?.partnership_stories &&
        partnership.partnership_stories.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, styles.screenMargin]}>
              {t('stories_of_partnership', {partnership: partnership.title})}
            </Text>
            <FlatList
              data={partnership.partnership_stories}
              renderItem={renderStories}
              horizontal={true}
              contentContainerStyle={styles.screenPadding}
              style={styles.similarList}
              showsHorizontalScrollIndicator={false}
            />
          </>
        )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderTopRightRadius: 24,
    borderTopLeftRadius: 24,
    zIndex: 100,
  },
  listContentContainer: {
    marginLeft: 20,
    marginRight: 20,
  },
  screenMargin: {
    marginHorizontal: 16,
  },
  screenPadding: {
    paddingHorizontal: 16,
  },
  quoteContainer: {
    minHeight: 200,
    marginBottom: 24,
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
  sectionTitle: {
    ...typography.h3,
    marginTop: 8,
    marginBottom: 16,
  },
  playbookCard: {
    marginRight: 10,
  },
  storyCard: {
    marginRight: 8,
  },
  similarList: {
    marginBottom: 24,
  },
  list: {
    width: variables.dimensions.width,
    marginBottom: 24,
  },
});

export default PartnershipContent;
