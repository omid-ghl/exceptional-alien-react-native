import {api} from '@/Services/api';
import {checkLatestAppVersion} from './initial';

export const initialApi = api.injectEndpoints({
  endpoints: build => ({
    checkLatestAppVersion: checkLatestAppVersion(build),
  }),
  overrideExisting: false,
});

export const {useLazyCheckLatestAppVersionQuery} = initialApi;
