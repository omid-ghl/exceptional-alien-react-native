import {GemNominationRequest, GemNominationResponse} from '@/Models';
import {ApiEndpointBuilder} from '@/Services/api';

export const gemNomination = (build: ApiEndpointBuilder) =>
  build.mutation<GemNominationResponse, GemNominationRequest>({
    query: params => ({
      url: 'nominate/gem',
      method: 'POST',
      params,
    }),
    transformResponse: (rawResult: {data}) => rawResult?.data,
  });
