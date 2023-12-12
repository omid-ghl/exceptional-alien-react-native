import {
  RemoveExistPlaybookRequest,
  RemoveExistPlaybookResponse,
} from '@/Models';
import {ApiEndpointBuilder} from '@/Services/api';

export default (build: ApiEndpointBuilder) =>
  build.mutation<RemoveExistPlaybookResponse, RemoveExistPlaybookRequest>({
    query: body => ({
      url: '/bookmarks/remove/playbook',
      body: body,
      method: 'POST',
    }),
    invalidatesTags: (result, error, arg) =>
      result ? [{type: 'PlaybookCollected' as const, id: arg.playbook_id}] : [],
  });
