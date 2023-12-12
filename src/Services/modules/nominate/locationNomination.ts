import {LocationNominationRequest, LocationNominationResponse} from '@/Models';
import {ApiEndpointBuilder} from '@/Services/api';

export const locationNomination = (build: ApiEndpointBuilder) =>
  build.mutation<LocationNominationResponse, LocationNominationRequest>({
    query: params => ({
      url: 'nominate/location',
      method: 'POST',
      params,
    }),
    transformResponse: (rawResult: {data}) => rawResult?.data,
  });
