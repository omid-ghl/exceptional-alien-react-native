import {Story} from './../../../Models/Story';
import {ApiEndpointBuilder} from '@/Services/api';
import {Gem} from '@/Models/Gem';
import {PlayBook} from '@/Models/PlayBook';
import {GetPartnershipsResponse, Partnership} from '@/Models';
import {
  GEMS_LIST_PER_PAGE,
  PARTNERSHIPS_LIST_PER_PAGE,
  PLAYBOOKS_LIST_PER_PAGE,
  STORIES_LIST_PER_PAGE,
} from '@/constants/common';

export const latestPlaybooks = (build: ApiEndpointBuilder) =>
  build.query<PlayBook[], number>({
    query: (page: number = 1) => {
      return {
        url: 'playbooks/filter',
        params: {
          page,
          order_by: 'desc',
          per_page: PLAYBOOKS_LIST_PER_PAGE,
          order_by_column: 'order_date',
        },
      };
    },
    transformResponse: (rawResult: {data: {data: PlayBook[]}}) => {
      return rawResult.data.data;
    },
  });

export const latestGems = (build: ApiEndpointBuilder) =>
  build.query<Gem[], number>({
    query: (page: number = 1) => {
      return {
        url: 'gems/',
        params: {
          page,
          order_by: 'desc',
          per_page: GEMS_LIST_PER_PAGE,
          order_by_column: 'created_at',
        },
      };
    },
    transformResponse: (rawResult: {data: {data: Gem[]}}) => {
      return rawResult.data.data;
    },
  });

export const latestStories = (build: ApiEndpointBuilder) =>
  build.query<Story[], number>({
    query: (page: number = 1) => {
      return {
        url: 'stories/',
        params: {
          page,
          order_by: 'desc',
          per_page: STORIES_LIST_PER_PAGE,
        },
      };
    },
    transformResponse: (rawResult: {data: {data: Story[]}}) => {
      return rawResult.data.data;
    },
  });

export const latestPartnerships = (build: ApiEndpointBuilder) =>
  build.query<Partnership[], number>({
    query: (page: number = 1) => {
      return {
        url: 'partnerships/',
        params: {
          page,
          order_by: 'desc',
          per_page: PARTNERSHIPS_LIST_PER_PAGE,
        },
      };
    },
    transformResponse: (rawResult: GetPartnershipsResponse) => {
      return rawResult.data.data;
    },
  });
