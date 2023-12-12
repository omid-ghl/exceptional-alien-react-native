import {ApiEndpointBuilder} from '@/Services/api';
import {ApiResponse, Location} from '@/Models';

export const locationsList = (build: ApiEndpointBuilder) =>
  build.query<Location[], void>({
    query: () => ({
      url: 'locations/all',
    }),
    transformResponse: (rawResult: ApiResponse<Location[]>) => {
      return rawResult.data;
    },
  });

export const locationById = (build: ApiEndpointBuilder) =>
  build.query<Location, {id?: number}>({
    query: ({id}: {id: number}) => ({
      url: `/locations/${id}`,
    }),
    transformResponse: (rawResult: {data: Location}) => {
      return rawResult.data;
    },
  });

export const randomLocation = (build: ApiEndpointBuilder) =>
  build.query({
    query: () => ({
      url: '/locations/random',
    }),
    transformResponse: (rawResult: {data: Location}) => {
      return rawResult.data;
    },
  });
