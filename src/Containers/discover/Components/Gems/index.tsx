import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  ListRenderItem,
  Text,
  TouchableOpacity,
  FlatList,
} from 'react-native';

import {colors, SVG, typography, variables} from '@/Theme';
import {Button, GemCard} from '@/Commons';
import {navigate} from '@/Navigators';
import {useAppSelector} from '@/Hooks';
import {TextSkeleton} from '@/Commons/Skeleton';
import {dimensions} from '@/Theme/Variables';
import {useGemsByLocationQuery} from '@/Services';
import DynamicFlatlist from '@/Commons/DynamicFlatlist';
import {Gem, GemCategory} from '@/Models';
import {useGemCategoriesQuery} from '@/Services/modules/discover';
import {useTranslation} from 'react-i18next';
import {GEM_CATEGORIES} from '@/constants/gemCategories';
import {SvgUri} from 'react-native-svg';

const GemsList: React.FC = ({}) => {
  const location = useAppSelector(state => state.discover.selectedLocation);
  const {t} = useTranslation();

  const [page, setPage] = useState(1);
  const [choosedIndustry, setChoosedIndustry] = useState<GemCategory | null>();
  const {
    currentData: gems,
    isLoading: isLoadingGems,
    isFetching: isFetchingGems,
    isError: isErrorGems,
    refetch: refetchGems,
  } = useGemsByLocationQuery(
    {
      locationId: location?.id,
      page: page,
      gemCategoryId: choosedIndustry?.id,
    },
    {
      skip: !location?.id,
    },
  );

  const {data: gemCategories} = useGemCategoriesQuery();

  const renderEmptyTags = () => {
    return (
      <TextSkeleton
        style={styles.skeletonTitleStyle}
        width={dimensions.width / 5}
        height={28}
        color={colors.gray10}
        count={5}
      />
    );
  };

  const RenderTag: ListRenderItem<GemCategory> = ({item}) => {
    const {name, id} = item;
    const isChoosen = choosedIndustry?.id === id;
    const iconUri =
      item.icon_details &&
      item.icon_details.length > 0 &&
      item.icon_details.toLowerCase().endsWith('.svg')
        ? item.icon_details
        : null;

    const CategoriesIconComp = iconUri
      ? null
      : id && id >= 1 && id <= GEM_CATEGORIES.length
      ? GEM_CATEGORIES[id - 1].bare
      : null;

    const handleTagPressed = () => {
      if (choosedIndustry === item) {
        return setChoosedIndustry(null);
      }
      setChoosedIndustry(item);
    };

    return (
      <TouchableOpacity
        onPress={handleTagPressed}
        style={[styles.tagContainer, isChoosen && styles.tagChosen]}>
        {iconUri && (
          <SvgUri
            width={20}
            height={20}
            uri={iconUri}
            stroke={isChoosen ? colors.primary : 'black'}
            color={isChoosen ? colors.primary : 'black'}
          />
        )}
        {CategoriesIconComp && (
          <CategoriesIconComp
            style={styles.iconStyle}
            height={15}
            width={15}
            stroke={isChoosen ? colors.primary : 'black'}
          />
        )}
        <Text
          style={[
            styles.tagText,
            {color: isChoosen ? colors.primary : colors.black},
          ]}>
          {name}
        </Text>
      </TouchableOpacity>
    );
  };

  const ListError = () => (
    <View style={styles.emptyWrapper}>
      <SVG.Gem stroke={colors.primary} height={48} width={48} />
      <Text style={styles.emptyTitleStyle}>{t('error')}</Text>
      <Text style={styles.emptySubtitleStyle}>{t('failed_fetch_gems')}</Text>
      <Button
        onPress={refetchGems}
        title={t('retry')}
        type="primary"
        style={styles.retryButton}
      />
    </View>
  );

  const ListEmptyGems = () => (
    <View style={styles.emptyWrapper}>
      <SVG.Gem stroke={colors.primary} height={48} width={48} />
      <Text style={styles.emptyTitleStyle}>{t('no_gems')}</Text>
      <Text style={styles.emptySubtitleStyle}>{t('no_gems_founded')}</Text>
    </View>
  );

  const renderItemGems: ListRenderItem<any> = ({item}) => {
    return (
      <View style={styles.gemCardWrapper}>
        <GemCard
          gem={item}
          onPress={() => navigate('gemDetails', {gemId: item.id, gem: item})}
          style={styles.card}
        />
      </View>
    );
  };

  const _renderStickyHeader = () => {
    return (
      <View style={[styles.gemCardWrapper]}>
        {gems?.data?.total || location?.count_of_gems ? (
          <Text style={styles.titleText2}>
            {(gems?.data?.total ?? location?.count_of_gems) +
              ' ' +
              t(
                (gems?.data?.total ?? location?.count_of_gems) === 1
                  ? 'gem_in'
                  : 'gems_in',
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

  const tagKeyExtractor = (item: GemCategory) => item.id.toString();
  const gemsKeyExtractor = (item: Gem) => item.id.toString();

  const getItemLayout = (data: Gem, index: number) => {
    return {
      length: dimensions.width * 0.6,
      offset: dimensions.width * 0.6 * data?.length,
      index,
    };
  };

  return (
    <View style={styles.mainWrapper}>
      <FlatList
        showsHorizontalScrollIndicator={false}
        style={[styles.horizontalList, styles.tagsList]}
        contentContainerStyle={styles.contentContainerStyle}
        horizontal
        bounces={false}
        data={gemCategories ?? []}
        keyExtractor={tagKeyExtractor}
        renderItem={RenderTag}
        ListEmptyComponent={renderEmptyTags}
      />
      {/* <Text>{JSON.stringify(gems)}</Text> */}
      <DynamicFlatlist
        extraData={choosedIndustry}
        getItemLayout={getItemLayout}
        dataKey={`${choosedIndustry?.id.toString()}${location?.id.toString()}`}
        isLoading={isLoadingGems}
        isFetching={isFetchingGems}
        data={gems?.data?.data ?? []}
        keyExtractor={gemsKeyExtractor}
        ListEmptyComponent={isErrorGems ? ListError : ListEmptyGems}
        renderItem={renderItemGems}
        pageCallBack={setPage}
        ListHeaderComponent={_renderStickyHeader}
        stickyHeaderIndices={[]}
        contentContainerStyle={styles.listContentContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainWrapper: {backgroundColor: 'white'},
  gemCardWrapper: {
    backgroundColor: 'white',
    zIndex: 100,
  },
  titleText2: {
    ...typography.h4,
    marginHorizontal: 16,
    marginVertical: 16,
    marginTop: 8,
  },
  card: {
    marginTop: 10,
    alignSelf: 'center',
  },
  tagContainer: {
    padding: 10,
    borderRadius: 40,
    flexDirection: 'row',
    alignItems: 'center',
    marginStart: 16,
    borderWidth: 1,
    borderColor: colors.white,
    backgroundColor: colors.gray10,
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

  horizontalList: { paddingBottom: 10},
  tagText: {
    ...typography.caption,
    marginStart: 5,
  },
  skeletonTitleStyle: {marginLeft: 16, marginVertical: 8, borderRadius: 100},
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
  iconStyle: {marginVertical: 10},
  retryButton: {
    paddingHorizontal: 22,
    marginTop: 16,
  },
  listContentContainer: {
    paddingBottom: 80,
  },
  contentContainerStyle: {
    paddingEnd: 16
  }
});

export default GemsList;
