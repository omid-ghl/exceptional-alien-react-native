import {ApiEndpointBuilder} from '@/Services/api';
import {GetPartnershipByIdResponse, Partnership} from '@/Models';

export const getPartnershipById = (build: ApiEndpointBuilder) =>
  build.query<Partnership, number>({
    query: partnershipId => ({
      url: 'partnerships/id/' + partnershipId,
    }),
    transformResponse: (rawResult: GetPartnershipByIdResponse) =>
      rawResult.data,
    providesTags: (result, error) =>
      error?.status === 401
        ? ['Unauthorized']
        : result
        ? [
            {type: 'PartnershipDetails' as const, id: result.id},
            'PartnershipDetails',
          ]
        : ['PartnershipDetails'],
  });
