import {api} from '@/Services/api';
import {
  latestGems,
  latestPartnerships,
  latestPlaybooks,
  latestStories,
} from './home';

export const homeApi = api.injectEndpoints({
  endpoints: build => ({
    latestPlaybooks: latestPlaybooks(build),
    latestGems: latestGems(build),
    latestStories: latestStories(build),
    latestPartnerships: latestPartnerships(build),
  }),
  overrideExisting: false,
});

export const {
  useLazyLatestPlaybooksQuery,
  useLazyLatestGemsQuery,
  useLazyLatestStoriesQuery,
  useLazyLatestPartnershipsQuery,
  useLatestGemsQuery,
  useLatestPlaybooksQuery,
  useLatestStoriesQuery,
  useLatestPartnershipsQuery,
} = homeApi;
