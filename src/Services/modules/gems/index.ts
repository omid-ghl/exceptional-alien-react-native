import {gemsByLocation} from './getGemsByLocation';
import {api} from '@/Services/api';
import {gemById} from './gemById';
import {similarGems} from './gems';
import {gemsByPlaybook} from './getGemsByPlaybook';
import gemsByUsersPlaybook from './gemsByUsersPlaybook';
import {gemCollected} from './gemCollected';
import {gemLikes} from './gemLikes';

export const gemsApi = api.injectEndpoints({
  endpoints: build => ({
    similarGems: similarGems(build),
    gemsByPlaybook: gemsByPlaybook(build),
    gemsByLocation: gemsByLocation(build),
    gemById: gemById(build),
    gemsByUsersPlaybook: gemsByUsersPlaybook(build),
    gemCollected: gemCollected(build),
    gemLikes: gemLikes(build),
  }),
  overrideExisting: false,
});

export const {
  useLazySimilarGemsQuery,
  useSimilarGemsQuery,
  useLazyGemsByPlaybookQuery,
  useGemsByLocationQuery,
  useLazyGemsByLocationQuery,
  useGemByIdQuery,
  usePrefetch: useGemsPrefetch,
  useLazyGemsByUsersPlaybookQuery,
  useGemsByUsersPlaybookQuery,
  useGemCollectedQuery,
  useGemLikesQuery,
} = gemsApi;
