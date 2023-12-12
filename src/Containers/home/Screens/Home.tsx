import React, {useMemo, useState} from 'react';
import {View, StyleSheet, Text, ScrollView, ListRenderItem} from 'react-native';
import {useTranslation} from 'react-i18next';

import {AppScreen, GemCard, PartnershipCard, PlaybookCard} from '@/Commons';
import {StackScreenProps} from '@react-navigation/stack';
import {StackParamList} from '@/Navigators/Stacks';
import {colors, SVG, typography, variables} from '@/Theme';
import {
  useLatestGemsQuery,
  useLatestPartnershipsQuery,
  useLatestPlaybooksQuery,
} from '@/Services';
import {Gem} from '@/Models/Gem';
import {TutorialCard} from '@/Containers/home/Components';
import {useAppSelector} from '@/Hooks';
import DynamicFlatlist from '@/Commons/DynamicFlatlist';
import {PlayBook} from '@/Models/PlayBook';
import {Partnership} from '@/Models';
import {
  GEMS_LIST_PER_PAGE,
  PARTNERSHIPS_LIST_PER_PAGE,
  PLAYBOOKS_LIST_PER_PAGE,
} from '@/constants/common';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const Home: React.FC<StackScreenProps<StackParamList, 'home'>> = ({
  navigation,
}) => {
  const {t} = useTranslation();

  const [gemListPage, setGemListPage] = useState<number>(1);
  const [playbookListPage, setPlaybookPage] = useState<number>(1);
  // const [storyListPage, setStoryPage] = useState<number>(1);
  const [partnershipsPage, setPartnershipsPage] = useState<number>(1);
  const insets = useSafeAreaInsets();

  const {
    data: dataGems,
    isLoading: isLoadingGems,
    isFetching: isFetchingGems,
  } = useLatestGemsQuery(gemListPage);

  const {
    data: dataPlaybooks,
    isLoading: isLoadingPlaybooks,
    isFetching: isFetchingPlaybooks,
  } = useLatestPlaybooksQuery(playbookListPage);

  // const {
  //   data: dataStories,
  //   isLoading: isLoadingStories,
  //   isFetching: isFetchingStories,
  // } = useLatestStoriesQuery(storyListPage);

  const {
    data: dataPartnerships,
    isLoading: isLoadingPartnerships,
    isFetching: isFetchingPartnerships,
  } = useLatestPartnershipsQuery(partnershipsPage);

  const isUserNew = useAppSelector(s => s.auth.userJustSignedUp);
  const isGuest = useAppSelector(s => s.auth.guest.guestMode);
  const name = useAppSelector(s => s.auth.user?.first_name);

  const listEmptyPlaybooks = () =>
    isLoadingPlaybooks ? <PlaybookCard playbook={null} isSkeleton /> : null;

  const listEmptyGems = () =>
    isLoadingGems ? <GemCard gem={null} isSkeleton /> : null;

  const listEmptyPartnerships = () =>
    isLoadingPartnerships ? (
      <PartnershipCard partnership={null} isSkeleton />
    ) : null;

  const gemListEnded = useMemo(() => {
    if (isLoadingGems || dataGems === undefined) {
      return false;
    }
    return dataGems.length < GEMS_LIST_PER_PAGE;
  }, [dataGems, isLoadingGems]);

  const playbookListEnded = useMemo(() => {
    if (isLoadingPlaybooks || dataPlaybooks === undefined) {
      return false;
    }
    return dataPlaybooks.length < PLAYBOOKS_LIST_PER_PAGE;
  }, [dataPlaybooks, isLoadingPlaybooks]);

  const partnershipListEnded = useMemo(() => {
    if (isLoadingPartnerships || dataPartnerships === undefined) {
      return false;
    }
    return dataPartnerships.length < PARTNERSHIPS_LIST_PER_PAGE;
  }, [dataPartnerships, isLoadingPartnerships]);

  const renderItemPlaybooks: ListRenderItem<PlayBook> = ({item}) => (
    <PlaybookCard
      playbook={item}
      onPress={() =>
        navigation.navigate('playBookDetails', {
          playBookId: item.id,
          playBook: item,
        })
      }
      style={styles.card}
    />
  );

  const renderItemGems: ListRenderItem<Gem> = ({item}) => (
    <GemCard
      gem={item}
      onPress={() =>
        navigation.navigate('gemDetails', {gemId: item.id, gem: item})
      }
      style={styles.card}
    />
  );

  // const renderItemStories: ListRenderItem<Story> = ({item}) => (
  //   <StoryCard
  //     story={item}
  //     onPress={() =>
  //       navigation.navigate('storyDetails', {storyId: item.id, story: item})
  //     }
  //     style={styles.card}
  //   />
  // );

  const renderItemPartnerships: ListRenderItem<Partnership> = ({item}) => (
    <PartnershipCard
      partnership={item}
      onPress={() => {
        navigation.navigate('partnershipDetails', {
          partnershipId: item.id,
          partnership: item,
        });
      }}
      style={styles.card}
    />
  );

  const titleText = isGuest
    ? t('welcome')
    : isUserNew
    ? t('welcome_user', {name: name})
    : t('welcome_back_user', {name: name});

  return (
    <AppScreen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContentContainer,
          {paddingTop: Math.max(80, insets.top)},
        ]}>
        <Text style={styles.titleText}>{titleText}</Text>
        <TutorialCard onPress={() => navigation.navigate('tutorial')} />
        <View style={styles.headerContainer}>
          <SVG.Categories stroke={colors.black} />
          <Text style={styles.headerText}>{t('latest_playbooks')}</Text>
        </View>
        <DynamicFlatlist
          swipable
          isLoading={isLoadingPlaybooks}
          isFetching={isFetchingPlaybooks}
          data={dataPlaybooks ?? []}
          keyExtractor={(item: PlayBook) => item.id.toString()}
          ListEmptyComponent={listEmptyPlaybooks}
          renderItem={renderItemPlaybooks}
          pageCallBack={setPlaybookPage}
          contentContainerStyle={styles.listContentContainer}
          style={styles.list}
          hasEnded={playbookListEnded}
        />
        <View style={styles.headerContainer}>
          <SVG.Gem stroke={colors.black} />
          <Text style={styles.headerText}>{t('latest_gems')}</Text>
        </View>

        <DynamicFlatlist
          swipable
          isLoading={isLoadingGems}
          isFetching={isFetchingGems}
          data={dataGems ?? []}
          keyExtractor={(item: Gem) => item.id.toString()}
          ListEmptyComponent={listEmptyGems}
          renderItem={renderItemGems}
          pageCallBack={setGemListPage}
          contentContainerStyle={styles.listContentContainer}
          style={styles.list}
          hasEnded={gemListEnded}
        />

        {/* <View style={styles.headerContainer}>
          <SVG.Story stroke={colors.black} />
          <Text style={styles.headerText}>{t('latest_stories')}</Text>
        </View>

        <DynamicFlatlist
          swipable
          isLoading={isLoadingStories}
          isFetching={isFetchingStories}
          data={dataStories ?? []}
          keyExtractor={(item: Story) => item.id.toString()}
          ListEmptyComponent={listEmptyPlaybooks}
          renderItem={renderItemStories}
          pageCallBack={setStoryPage}
          style={styles.list}
        /> */}

        <View style={styles.headerContainer}>
          <Text style={[styles.headerText, styles.noIconText]}>
            {t('travel_playbook_partnerships')}
          </Text>
        </View>

        <DynamicFlatlist
          swipable
          isLoading={isLoadingPartnerships}
          isFetching={isFetchingPartnerships}
          data={dataPartnerships ?? []}
          keyExtractor={(item: Partnership) => item.id.toString()}
          ListEmptyComponent={listEmptyPartnerships}
          renderItem={renderItemPartnerships}
          pageCallBack={setPartnershipsPage}
          contentContainerStyle={styles.listContentContainer}
          style={styles.list}
          hasEnded={partnershipListEnded}
        />
      </ScrollView>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  titleText: {
    ...typography.h1,
    marginHorizontal: 16,
    marginBottom: 24,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 16,
  },
  headerText: {
    ...typography.h3,
    marginHorizontal: 10,
  },
  noIconText: {
    marginHorizontal: 0,
  },
  list: {
    width: variables.dimensions.width,
  },
  listContentContainer: {
    marginLeft: 20,
    marginRight: 20,
  },
  scrollContentContainer: {
    paddingBottom: 16,
  },
  card: {
    marginRight: 10,
  },
});

export default Home;
