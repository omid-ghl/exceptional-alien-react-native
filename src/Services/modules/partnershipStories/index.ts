import {api} from '@/Services/api';
import {partnershipStoryById} from './partnershipStoryById';

export const partnershipStoriesApi = api.injectEndpoints({
  endpoints: build => ({
    partnershipStoryById: partnershipStoryById(build),
  }),
  overrideExisting: false,
});

export const {
  usePartnershipStoryByIdQuery,
  usePrefetch: usePartnershipsPrefetch,
} = partnershipStoriesApi;
