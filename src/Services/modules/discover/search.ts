import {ApiEndpointBuilder} from '@/Services/api';
import {SearchGlobalResponse} from '@/Models';
import {SearchTag} from '@/Models/SearchTag';
import {GEMS_LIST_PER_PAGE, PLAYBOOKS_LIST_PER_PAGE} from '@/constants/common';

export const searchList = (build: ApiEndpointBuilder) =>
  build.query<SearchGlobalResponse['data'], {search: string; perPage?: number}>(
    {
      query: ({search, perPage = GEMS_LIST_PER_PAGE}) => ({
        url: 'search/global',
        params: {
          per_page: perPage,
          search,
        },
      }),
      transformResponse: (rawResult: SearchGlobalResponse) => {
        return rawResult.data;
      },
    },
  );

export const filterPlaybooks = (build: ApiEndpointBuilder) =>
  build.query<
    any,
    {search: string; page: number; perPage?: number; industry_id?: number}
  >({
    query: ({search, page = 1, industry_id}) => ({
      url: 'playbooks/filter',
      params: {
        per_page: PLAYBOOKS_LIST_PER_PAGE,
        page,
        search,
        industry_id,
      },
    }),
    transformResponse: (rawResult: {data: {data: SearchTag}}) => {
      return rawResult.data;
    },
  });
