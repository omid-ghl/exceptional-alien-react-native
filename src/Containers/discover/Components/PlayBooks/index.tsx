import React, {useState} from 'react';
import {StyleSheet, Text, ListRenderItem, View} from 'react-native';

import {colors, SVG, typography, variables} from '@/Theme';
import {Button, PlaybookCard} from '@/Commons';
import {useTranslation} from 'react-i18next';
import {navigate} from '@/Navigators';
import {useAppSelector} from '@/Hooks';
import {PlayBook} from '@/Models/PlayBook';
import {TextSkeleton} from '@/Commons/Skeleton';
import {dimensions} from '@/Theme/Variables';
import {usePlaybooksByLocationQuery} from '@/Services/modules/playbooks';
import DynamicFlatlist from '@/Commons/DynamicFlatlist';

const PlayBooksList: React.FC = ({}) => {
  const {t} = useTranslation();

  const location = useAppSelector(state => state.discover.selectedLocation);

  const [page, setPage] = useState(1);
  // const [choosedIndustry, setChoosedIndustry] = useState<Industry | null>();

  const {
    currentData: playbooks,
    isLoading: isLoadingPlaybooks,
    isFetching: isFetchingPlaybooks,
    refetch: refetchPlaybooks,
    isError: isErrorPlaybooks,
  } = usePlaybooksByLocationQuery(
    {
      locationId: location?.id,
      page: page,
      perPage: 10,
      // playbookCategoryId: choosedIndustry?.id,
    },
    {
      skip: !location?.id,
    },
  );

  // const {data: industriesSearchList, isLoading: industriesIsLoading} =
  //   useIndustriesSearchListQuery();

  // const renderEmptyTags = () => {
  //   return (
  //     <TextSkeleton
  //       style={styles.skeletonTitleStyle}
  //       width={dimensions.width / 5}
  //       height={28}
  //       color={colors.gray10}
  //       count={5}
  //     />
  //   );
  // };

  // const RenderTag: ListRenderItem<Industry> = ({item}) => {
  //   const {name} = item;
  //   const isChoosen = choosedIndustry?.id === item.id;
  //   return (
  //     <TouchableOpacity
  //       onPress={() => {
  //         setChoosedIndustry(item);
  //       }}
  //       style={[styles.tagContainer, isChoosen && styles.tagChosen]}>
  //       <Image source={{uri: item.image_url.url}} style={styles.tagImage} />
  //       <Text
  //         style={[
  //           styles.tagText,
  //           {color: isChoosen ? colors.primary : colors.black},
  //         ]}>
  //         {name}
  //       </Text>
  //     </TouchableOpacity>
  //   );
  // };

  const ListError = () => (
    <View style={styles.emptyWrapper}>
      <SVG.Playbooks stroke={colors.primary} height={48} width={48} />
      <Text style={styles.emptyTitleStyle}>{t('error')}</Text>
      <Text style={styles.emptySubtitleStyle}>
        {t('failed_fetch_playbooks')}
      </Text>
      <Button
        onPress={refetchPlaybooks}
        title={t('retry')}
        type="primary"
        style={styles.retryButton}
      />
    </View>
  );

  const listEmptyPlaybooks = () => (
    <View style={styles.emptyWrapper}>
      <SVG.Playbooks stroke={colors.primary} height={48} width={48} />
      <Text style={styles.emptyTitleStyle}>{t('no_playbooks')}</Text>
      <Text style={styles.emptySubtitleStyle}>{t('no_playbooks_founded')}</Text>
    </View>
  );

  const renderItemPlaybooks: ListRenderItem<PlayBook> = ({item, index}) => {
    return (
      <View key={index} style={[styles.gemCardWrapper, styles.alignCenter]}>
        <PlaybookCard
          onPress={() =>
            navigate('playBookDetails', {
              playBookId: item.id,
              playBook: item,
            })
          }
          style={styles.marginTop10}
          playbook={item}
        />
      </View>
    );
  };

  const _renderStickyHeader = () => {
    return (
      <View style={[styles.gemCardWrapper]}>
        {playbooks?.total || location?.count_of_playbooks ? (
          <Text style={styles.titleText2}>
            {(playbooks?.total ?? location?.count_of_playbooks) +
              ' ' +
              t(
                (playbooks?.total ?? location?.count_of_playbooks) === 1
                  ? 'playbook_in'
                  : 'playbooks_in',
              ) +
              ' ' +
              location?.name}
          </Text>
        ) : (
          <TextSkeleton
            style={styles.skeletonTitleStyle}
            width={dimensions.width / 2}
            height={28}
            color={colors.gray10}
          />
        )}
      </View>
    );
  };

  return (
    <View style={styles.mainWrapper}>
      {/* <FlatList
        extraData={choosedIndustry}
        showsHorizontalScrollIndicator={false}
        style={[styles.marginHorizontal16]}
        horizontal
        data={industriesSearchList?.industries ?? []}
        keyExtractor={item => item.slug}
        renderItem={RenderTag}
        ListEmptyComponent={renderEmptyTags}
      /> */}
      <DynamicFlatlist
        dataKey={location?.id.toString()}
        isLoading={isLoadingPlaybooks}
        isFetching={isFetchingPlaybooks}
        data={playbooks?.data ?? []}
        keyExtractor={(item: PlayBook) => item.id.toString()}
        ListEmptyComponent={isErrorPlaybooks ? ListError : listEmptyPlaybooks}
        renderItem={renderItemPlaybooks}
        pageCallBack={setPage}
        ListHeaderComponent={_renderStickyHeader}
        stickyHeaderIndices={[]}
        contentContainerStyle={styles.listContentContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  marginTop10: {marginTop: 10},
  skeletonTitleStyle: {marginLeft: 16, marginVertical: 8, borderRadius: 100},
  titleText2: {
    ...typography.h4,
    marginHorizontal: 16,
    marginVertical: 16,
    marginTop: 8,
  },
  mainWrapper: {backgroundColor: colors.white},
  gemCardWrapper: {
    backgroundColor: colors.white,
    zIndex: 100,
  },

  tagContainer: {
    paddingHorizontal: 10,
    backgroundColor: colors.gray10,
    borderRadius: 40,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    borderColor: colors.white,
    borderWidth: 1,
  },
  tagChosen: {
    backgroundColor: 'transparent',
    borderColor: colors.primary,
  },
  tagImage: {
    width: 12,
    height: 12,
    marginRight: 5,
  },
  tagsList: {
    paddingBottom: 8,
    flexGrow: 0,
  },
  marginHorizontal16: {marginHorizontal: 16, paddingBottom: 10},
  tagText: {
    ...typography.caption,
    paddingVertical: 8,
  },
  alignCenter: {
    alignItems: 'center',
  },
  emptyWrapper: {
    alignSelf: 'center',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    height: variables.dimensions.height / 2,
  },
  emptyTitleStyle: {
    ...typography.h4,
    alignSelf: 'center',
    marginTop: 20,
  },
  emptySubtitleStyle: {
    ...typography.caption,
    width: variables.dimensions.width / 1.5,
    color: colors.gray100,
    textAlign: 'center',
    marginTop: 14,
    alignSelf: 'center',
  },
  emptyButtonStyle: {
    marginTop: 24,
    width: variables.dimensions.width / 1.5,
    alignSelf: 'center',
  },
  retryButton: {
    paddingHorizontal: 22,
    marginTop: 16,
  },
  listContentContainer: {
    paddingBottom: 80,
  },
});

export default PlayBooksList;
