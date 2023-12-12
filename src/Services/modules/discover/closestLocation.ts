import {ApiEndpointBuilder} from '@/Services/api';
import {Location} from '@/Models';

export const closestLocation = (build: ApiEndpointBuilder) =>
  build.query<Location, {lat?: number; lng?: number}>({
    query: ({lat, lng}: {lat?: number; lng?: number}) => ({
      url: '/locations/closest',
      params: {
        lat,
        lng,
      },
    }),
    transformResponse: (rawResult: {data: Location}) => {
      return rawResult.data;
    },
  });
