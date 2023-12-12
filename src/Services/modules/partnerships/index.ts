import {api} from '@/Services/api';
import {getPartnershipById} from './getPartnershipById';

export const partnershipsApi = api.injectEndpoints({
  endpoints: build => ({
    partnershipById: getPartnershipById(build),
  }),
  overrideExisting: false,
});

export const {usePartnershipByIdQuery, usePrefetch: usePartnershipsPrefetch} =
  partnershipsApi;
