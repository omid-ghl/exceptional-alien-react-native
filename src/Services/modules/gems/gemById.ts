import {ApiEndpointBuilder} from '@/Services/api';
import {Gem, GetGemByIdResponse} from '@/Models';

export const gemById = (build: ApiEndpointBuilder) =>
  build.query<Gem, number>({
    query: gemId => ({
      url: 'gems/' + gemId,
    }),
    transformResponse: (rawResult: GetGemByIdResponse) => rawResult.data,
    providesTags: (result, error) =>
      error?.status === 401
        ? ['Unauthorized']
        : result
        ? [{type: 'GemDetails' as const, id: result.id}, 'GemDetails']
        : ['GemDetails'],
  });
