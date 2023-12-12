import {ApiEndpointBuilder} from '@/Services/api';
import {GetVideoByIdResponse, Video} from '@/Models';

export const videoById = (build: ApiEndpointBuilder) =>
  build.query<Video, number>({
    query: videoId => ({
      url: 'videos/' + videoId,
    }),
    transformResponse: (rawResult: GetVideoByIdResponse) => rawResult.data,
    providesTags: (result, error) =>
      error?.status === 401 ? ['Unauthorized'] : [],
  });
