import {ApiEndpointBuilder} from '@/Services/api';
import {GetGemsByLocationRequest, GetGemsByLocationResponse} from '@/Models';
import {GEMS_LIST_PER_PAGE} from '@/constants/common';

export const gemsByLocation = (build: ApiEndpointBuilder) =>
  build.query<GetGemsByLocationResponse, GetGemsByLocationRequest>({
    query: ({
      locationId,
      page,
      perPage = GEMS_LIST_PER_PAGE,
      gemCategoryId,
    }) => ({
      url: 'gems/location',
      params: {
        location_id: locationId,
        page: page,
        per_page: perPage,
        gem_category_id: gemCategoryId,
        order_by: 'desc',
        order_by_column: 'created_at',
      },
    }),
    transformResponse: (rawResult: GetGemsByLocationResponse) => {
      return rawResult;
    },
  });
