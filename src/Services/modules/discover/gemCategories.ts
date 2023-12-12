import {ApiEndpointBuilder} from '@/Services/api';
import {GemCategory, GetGemCategoriesResponse} from '@/Models';

export const gemCategories = (build: ApiEndpointBuilder) =>
  build.query<GemCategory[], void>({
    query: () => ({
      url: 'gems/categories',
    }),
    transformResponse: (rawResult: GetGemCategoriesResponse) => {
      return rawResult.data;
    },
  });
