import {ApiEndpointBuilder} from '@/Services/api';
import {GetPlaybookByIdResponse, PlayBook} from '@/Models';

export const getPlaybookById = (build: ApiEndpointBuilder) =>
  build.query<PlayBook, number>({
    query: playbookId => ({
      url: 'playbooks/' + playbookId,
    }),
    transformResponse: (rawResult: GetPlaybookByIdResponse) => rawResult.data,
    providesTags: (result, error) =>
      error?.status === 401
        ? ['Unauthorized']
        : result
        ? [{type: 'PlaybookDetails' as const, id: result.id}, 'PlaybookDetails']
        : ['PlaybookDetails'],
  });
