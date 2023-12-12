import {api} from '@/Services/api';
import {getStoryById} from './getStoryById';

export const storiesApi = api.injectEndpoints({
  endpoints: build => ({
    storyById: getStoryById(build),
  }),
  overrideExisting: false,
});

export const {useStoryByIdQuery, usePrefetch: usePartnershipsPrefetch} =
  storiesApi;
