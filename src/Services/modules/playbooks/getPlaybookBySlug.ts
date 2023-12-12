import {ApiEndpointBuilder} from '@/Services/api';
import {GetPlaybookByIdResponse, PlayBook} from '@/Models';

export const getPlaybookBySlug = (build: ApiEndpointBuilder) =>
  build.query<PlayBook, string>({
    query: slug => ({
      url: 'playbooks/slug',
      params: {
        slug,
      },
    }),
    transformResponse: (rawResult: GetPlaybookByIdResponse) => rawResult.data,
    providesTags: (result, error) =>
      error?.status === 401
        ? ['Unauthorized']
        : result
        ? [{type: 'PlaybookDetails' as const, id: result.id}, 'PlaybookDetails']
        : ['PlaybookDetails'],
  });
