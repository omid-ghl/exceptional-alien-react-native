import {api} from '@/Services/api';
import {videoById} from './videoById';

export const videoApi = api.injectEndpoints({
  endpoints: build => ({
    videoById: videoById(build),
  }),
  overrideExisting: false,
});

export const {useVideoByIdQuery, usePrefetch: useVideoPrefetch} = videoApi;
