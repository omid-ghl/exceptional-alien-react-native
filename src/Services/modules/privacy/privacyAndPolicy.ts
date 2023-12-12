import {ApiEndpointBuilder} from '@/Services/api';

export const privacyAndPolicy = (build: ApiEndpointBuilder) =>
  build.query({
    query: () => {
      return {
        url: 'pages/slug/terms-and-privacy',
      };
    },
    transformResponse: (rawResult: {data: any}) => {
      return rawResult;
    },
  });
