import {ApiEndpointBuilder} from '@/Services/api';
import {GetGemCollectedResponse} from '@/Models';

export const gemCollected = (build: ApiEndpointBuilder) =>
  build.query<boolean, number>({
    query: gemId => ({
      url: 'app/gems/collected',
      params: {
        gem_id: gemId,
      },
    }),
    transformResponse: (rawResult: GetGemCollectedResponse) => rawResult.data,
    providesTags: (result, error, arg) =>
      error?.status === 401
        ? ['Unauthorized']
        : result !== undefined
        ? [{type: 'GemCollected' as const, id: arg}, 'GemCollected']
        : ['GemCollected'],
  });
