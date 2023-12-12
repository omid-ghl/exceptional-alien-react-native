import {api} from '@/Services/api';
import {
  listIndustries,
  listLocations,
  onboardingComplete,
  upsertInterests,
} from './onboarding';

export const onboardingApi = api.injectEndpoints({
  endpoints: build => ({
    listLocations: listLocations(build),
    listIndustries: listIndustries(build),
    upsertInterests: upsertInterests(build),
    onboardingComplete: onboardingComplete(build),
  }),
  overrideExisting: false,
});

export const {
  useListLocationsQuery,
  useListIndustriesQuery,
  usePrefetch: useOnboardingPrefetch,
  useUpsertInterestsMutation,
  useOnboardingCompleteMutation,
} = onboardingApi;
