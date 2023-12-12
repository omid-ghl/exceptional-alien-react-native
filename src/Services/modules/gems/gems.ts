import {ApiEndpointBuilder} from '@/Services/api';
import {Gem, SimilarGemsResponse} from '@/Models';
import {GEMS_LIST_PER_PAGE} from '@/constants/common';

export const similarGems = (build: ApiEndpointBuilder) =>
  build.query<Gem[], {perPage?: number; page?: number; gemId: number}>({
    query: ({gemId, page, perPage}) => ({
      url: 'gems/similar',
      params: {
        gem_id: gemId,
        page: page,
        per_page: perPage ?? GEMS_LIST_PER_PAGE,
      },
    }),
    transformResponse: (rawResult: SimilarGemsResponse) => rawResult.data.data,
    providesTags: (result, error) =>
      error?.status === 401
        ? ['Unauthorized']
        : result
        ? [...result.map(({id}) => ({type: 'Gem' as const, id})), 'Gem']
        : ['Gem'],
  });
