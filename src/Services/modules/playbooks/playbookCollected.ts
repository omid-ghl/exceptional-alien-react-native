import {ApiEndpointBuilder} from '@/Services/api';
import {GetPlaybookCollectedResponse} from '@/Models';

export const playbookCollected = (build: ApiEndpointBuilder) =>
  build.query<boolean, number>({
    query: playbookId => ({
      url: 'app/playbooks/collected',
      params: {
        playbook_id: playbookId,
      },
    }),
    transformResponse: (rawResult: GetPlaybookCollectedResponse) =>
      rawResult.data,
    providesTags: (result, error, arg) =>
      error?.status === 401
        ? ['Unauthorized']
        : result !== undefined
        ? [{type: 'PlaybookCollected' as const, id: arg}, 'PlaybookCollected']
        : ['PlaybookCollected'],
  });
