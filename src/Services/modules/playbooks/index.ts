import {api} from '@/Services/api';
import {getPlaybookById} from './getPlaybookById';
import {getPlaybookBySlug} from './getPlaybookBySlug';
import {playbooksByLocation} from './getPlaybooksByLocation';
import {getPlaybooksCreatedByUser} from './getPlaybooksCreatedByUser';
import {playbookCollected} from './playbookCollected';

export const gemsApi = api.injectEndpoints({
  endpoints: build => ({
    playbooksByLocation: playbooksByLocation(build),
    playbookById: getPlaybookById(build),
    playbookBySlug: getPlaybookBySlug(build),
    getPlaybooksCreatedByUser: getPlaybooksCreatedByUser(build),
    playbookCollected: playbookCollected(build),
  }),
  overrideExisting: false,
});

export const {
  usePlaybooksByLocationQuery,
  useLazyPlaybooksByLocationQuery,
  usePlaybookByIdQuery,
  usePlaybookBySlugQuery,
  usePrefetch: usePlaybooksPrefetch,
  useGetPlaybooksCreatedByUserQuery,
  useLazyGetPlaybooksCreatedByUserQuery,
  usePlaybookCollectedQuery,
} = gemsApi;
