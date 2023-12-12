import {ApiEndpointBuilder} from '@/Services/api';
import {
  Industry,
  Interest,
  ListIndustriesResponse,
  ListLocationsResponse,
  OnboardingCompleteRequest,
  OnboardingCompleteResponse,
  UpsertInterestsRequest,
  UpsertInterestsResponse,
} from '@/Models';
import {Location} from '@/Models';

export const listLocations = (build: ApiEndpointBuilder) =>
  build.query<Location[], void>({
    query: () => ({
      url: 'onboarding/list/locations',
      params: {
        order_by: 'asc',
      },
    }),
    transformResponse: (rawResult: ListLocationsResponse) =>
      rawResult.data.options.data,
    providesTags: (result, error) =>
      error?.status === 401 ? ['Unauthorized'] : [],
  });

export const listIndustries = (build: ApiEndpointBuilder) =>
  build.query<Industry[], void>({
    query: () => 'onboarding/list/industries',
    transformResponse: (rawResult: ListIndustriesResponse) => {
      return rawResult.data.options.data;
    },
    providesTags: (result, error) =>
      error?.status === 401 ? ['Unauthorized'] : [],
  });

export const upsertInterests = (build: ApiEndpointBuilder) =>
  build.mutation<Interest[], UpsertInterestsRequest>({
    query: body => ({
      url: 'onboarding/upsert/interests',
      method: 'POST',
      body: body,
    }),
    transformResponse: (rawResult: UpsertInterestsResponse) => rawResult.data,
  });

export const onboardingComplete = (build: ApiEndpointBuilder) =>
  build.mutation<OnboardingCompleteResponse, OnboardingCompleteRequest>({
    query: body => ({
      url: 'onboarding/complete',
      method: 'POST',
      body: body,
    }),
    invalidatesTags: result => (result ? ['User'] : []),
  });
