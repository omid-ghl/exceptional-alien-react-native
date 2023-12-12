import {AddGemToPlaybookRequest} from '@/Models/Requests/AddGemToPlaybookRequest';
import {AddGemToPlaybookResponse} from '@/Models/Responses/AddGemToPlaybookResponse';
import {ApiEndpointBuilder} from '@/Services/api';

export default (build: ApiEndpointBuilder) =>
  build.mutation<AddGemToPlaybookResponse, AddGemToPlaybookRequest>({
    query: body => ({
      url: '/user/playbooks/add/gem',
      body,
      method: 'POST',
    }),
    invalidatesTags: (result, error, arg) =>
      result
        ? [{type: 'UserPlaybookGems' as const, id: arg.user_playbook_id}]
        : [],
  });
