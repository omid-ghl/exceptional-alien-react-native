import {ApiEndpointBuilder} from '@/Services/api';
import {Gem, GetUserPlaybookByIdResponse} from '@/Models';

export default (build: ApiEndpointBuilder) =>
  build.query<Gem[], {user_playbook_id: number}>({
    query: ({user_playbook_id}) => ({
      url: 'user/playbooks/show',
      params: {
        user_playbook_id,
      },
    }),
    transformResponse: (rawResult: GetUserPlaybookByIdResponse) =>
      rawResult.data.gems ?? [],
    providesTags: (result, error, arg) =>
      error?.status === 401
        ? ['Unauthorized']
        : result !== undefined
        ? [
            {type: 'UserPlaybookGems' as const, id: arg.user_playbook_id},
            'UserPlaybookGems',
          ]
        : ['UserPlaybookGems'],
  });
