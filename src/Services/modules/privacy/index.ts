import {privacyAndPolicy} from './privacyAndPolicy';
import {api} from '@/Services/api';

export const privaciesApi = api.injectEndpoints({
  endpoints: build => ({
    privacyAndPolicy: privacyAndPolicy(build),
  }),
  overrideExisting: false,
});

export const {usePrivacyAndPolicyQuery} = privaciesApi;
