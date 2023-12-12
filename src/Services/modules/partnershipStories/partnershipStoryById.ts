import {ApiEndpointBuilder} from '@/Services/api';
import {GetPartnershipStoryByIdResponse, PartnershipStory} from '@/Models';

export const partnershipStoryById = (build: ApiEndpointBuilder) =>
  build.query<PartnershipStory, number>({
    query: partnershipStoryId => ({
      url: 'partnerships/stories/id/' + partnershipStoryId,
    }),
    transformResponse: (rawResult: GetPartnershipStoryByIdResponse) =>
      rawResult.data,
    providesTags: (_, error) => (error?.status === 401 ? ['Unauthorized'] : []),
  });
