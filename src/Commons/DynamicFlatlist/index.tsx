import {variables} from '@/Theme';
import React, {useEffect, useMemo, useState} from 'react';
import {ActivityIndicator, FlatList, StyleSheet, View} from 'react-native';
import {IDynamicFlatlist} from './DynamicFlatlist';

const DynamicFlatlist: React.FC<IDynamicFlatlist.IProps> = ({
  isLoading = false,
  isFetching = false,
  onEndReached = () => {},
  onScroll = () => {},
  data,
  keyExtractor,
  ListEmptyComponent,
  renderItem,
  pageCallBack = () => {},
  swipable = false,
  ListFooterComponent,
  style,
  stickyHeaderIndices,
  stickyItems = [],
  refreshControl,
  dataKey = '',
  ListHeaderComponent,
  contentContainerStyle,
  ref,
  dataCallback = () => {},
  getItemLayout,
  extraData,
  hasEnded,
}) => {
  const [finalData, setFinalData] = useState<any[]>([]);
  const [listPage, setListPage] = useState<number>(1);
  const [itemsKey, setItemsKey] = useState('');

  const concatMetric =
    data?.length > 0 &&
    data[data.length - 1]?.id !== finalData?.[finalData?.length - 1]?.id;

  useEffect(() => {
    dataCallback(finalData);
  }, [dataCallback, finalData]);

  useMemo(() => {
    if (concatMetric && dataKey === itemsKey) {
      setFinalData([...finalData, ...data]);
    } else if (dataKey !== itemsKey) {
      setFinalData(data ?? []);
      setItemsKey(dataKey);
      setListPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, dataKey]);

  useEffect(() => {
    pageCallBack(listPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listPage]);

  const addStickyItemsToData = (array: Array<object>) =>
    [...stickyItems, ...array] as (object & {hasLoading?: boolean})[];

  return (
    <>
      {swipable ? (
        <FlatList
          style={style}
          onEndReached={() => {
            if (!isLoading && !isFetching && !hasEnded) {
              setListPage(listPage + 1);
              onEndReached(finalData.length - 1);
            }
          }}
          data={addStickyItemsToData(
            hasEnded
              ? [...finalData]
              : [...finalData, {id: 'nonId', hasLoading: isLoading}],
          )}
          keyExtractor={keyExtractor}
          ListEmptyComponent={ListEmptyComponent}
          renderItem={item => {
            if ((item as any & {hasLoading?: boolean})?.hasLoading) {
              return renderItem({isSkeleton: true} as any);
            }
            return renderItem(item);
          }}
          onEndReachedThreshold={1}
          contentContainerStyle={contentContainerStyle}
          snapToInterval={variables.dimensions.width - 30}
          snapToAlignment="start"
          decelerationRate="fast"
          horizontal
          showsHorizontalScrollIndicator={false}
          contentOffset={{x: 10, y: 0}}
        />
      ) : (
        <FlatList
          contentContainerStyle={contentContainerStyle}
          ref={ref}
          onScroll={onScroll}
          onEndReachedThreshold={0}
          refreshControl={refreshControl}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          style={style}
          data={addStickyItemsToData(finalData)}
          extraData={extraData}
          keyExtractor={keyExtractor}
          ListEmptyComponent={
            !isLoading && !isFetching ? ListEmptyComponent : null
          }
          renderItem={renderItem}
          stickyHeaderIndices={stickyHeaderIndices}
          ListHeaderComponent={ListHeaderComponent}
          ListFooterComponent={
            ListFooterComponent ? (
              ListFooterComponent
            ) : (
              <>
                {isLoading || isFetching ? (
                  <ActivityIndicator style={styles.marginVertical20} />
                ) : (
                  <View style={styles.marginVertical20} />
                )}
              </>
            )
          }
          onEndReached={_e => {
            if (!isLoading && !isFetching && data.length > 0 && !hasEnded) {
              console.info('listPage', listPage);
              setListPage(listPage + 1);
            }
            if (finalData.length > 2) {
              onEndReached();
            }
          }}
          getItemLayout={getItemLayout}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  marginVertical20: {marginVertical: 25},
});

export default DynamicFlatlist;
