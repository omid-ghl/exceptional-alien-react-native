import {PersonNominationRequest, PersonNominationResponse} from '@/Models';
import {ApiEndpointBuilder} from '@/Services/api';

export const personNomination = (build: ApiEndpointBuilder) =>
  build.mutation<PersonNominationResponse, PersonNominationRequest>({
    query: params => ({
      url: 'nominate/person',
      method: 'POST',
      params,
    }),
    transformResponse: (rawResult: {data}) => rawResult?.data,
  });
