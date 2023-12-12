import {ApiEndpointBuilder} from '@/Services/api';
import {GetStoryByIdResponse, Story} from '@/Models';

export const getStoryById = (build: ApiEndpointBuilder) =>
  build.query<Story, number>({
    query: storyId => ({
      url: 'stories/' + storyId,
    }),
    transformResponse: (rawResult: GetStoryByIdResponse) => rawResult.data,
    providesTags: (result, error) =>
      error?.status === 401
        ? ['Unauthorized']
        : result
        ? [{type: 'StoryDetails' as const, id: result.id}, 'StoryDetails']
        : ['StoryDetails'],
  });
