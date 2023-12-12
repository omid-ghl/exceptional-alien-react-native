import {ApiEndpointBuilder} from '@/Services/api';
import {GetGemLikesResponse} from '@/Models';

export const gemLikes = (build: ApiEndpointBuilder) =>
  build.query<number, number>({
    query: gemId => ({
      url: 'gems/likes',
      params: {
        gem_id: gemId,
      },
    }),
    transformResponse: (rawResult: GetGemLikesResponse) => rawResult.data,
    providesTags: (result, error, arg) =>
      error?.status === 401
        ? ['Unauthorized']
        : result !== undefined
        ? [{type: 'GemLikes' as const, id: arg}, 'GemLikes']
        : ['GemLikes'],
  });
