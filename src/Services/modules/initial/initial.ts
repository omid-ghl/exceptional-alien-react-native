import {ApiEndpointBuilder} from '@/Services/api';

export const checkLatestAppVersion = (build: ApiEndpointBuilder) =>
  build.query({
    query: () => {
      return {
        url: 'setting/appMinimumVersion',
      };
    },
    transformResponse: (rawResult: {data: any}) => {
      return rawResult;
    },
  });
