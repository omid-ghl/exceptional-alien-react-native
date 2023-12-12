import {AddNewPlaybookRequest, AddNewPlaybookResponse} from '@/Models';
import {ApiEndpointBuilder} from '@/Services/api';

export default (build: ApiEndpointBuilder) =>
  build.mutation<AddNewPlaybookResponse, AddNewPlaybookRequest>({
    query: params => ({
      url: '/bookmarks/add/playbook',
      params: params,
      method: 'POST',
    }),
    invalidatesTags: (result, error, arg) =>
      result ? [{type: 'PlaybookCollected' as const, id: arg.playbook_id}] : [],
  });
