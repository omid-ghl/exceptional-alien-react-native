import {RemoveGemFromPlaybookResponse} from './../../../Models/Responses/RemoveGemFromPlaybookResponse';
import {ApiEndpointBuilder} from '@/Services/api';
import {RemoveGemFromPlaybookRequest} from '@/Models/Requests/RemoveGemFromPlaybookRequest';

export default (build: ApiEndpointBuilder) =>
  build.mutation<RemoveGemFromPlaybookResponse, RemoveGemFromPlaybookRequest>({
    query: body => ({
      url: '/user/playbooks/remove/gem',
      body,
      method: 'POST',
    }),
    invalidatesTags: (result, error, arg) =>
      result
        ? [{type: 'UserPlaybookGems' as const, id: arg.user_playbook_id}]
        : [],
  });
