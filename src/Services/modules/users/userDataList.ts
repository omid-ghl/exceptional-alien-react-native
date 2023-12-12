import {Gem, PlayBook} from '@/Models';
import {ApiEndpointBuilder} from '@/Services/api';

export const userGemsList = (build: ApiEndpointBuilder) =>
  build.query<Gem[], void>({
    query: () => ({
      url: 'bookmarks/list',
      params: {
        model: 'gem',
      },
    }),
    transformResponse: (rawResult: {data: Array<Gem>}) => {
      return rawResult.data;
    },
  });

export const userPlaybooksList = (build: ApiEndpointBuilder) =>
  build.query<PlayBook[], void>({
    query: () => ({
      url: 'bookmarks/list',
      params: {
        model: 'playbook',
      },
    }),
    transformResponse: (rawResult: {data: Array<PlayBook>}) => {
      return rawResult.data;
    },
  });

export const userInterestedList = (build: ApiEndpointBuilder) =>
  build.query({
    query: () => ({
      url: 'onboarding/interests/list',
    }),
    transformResponse: (rawResult: {data: Array<any>}) => {
      return rawResult.data;
    },
  });
