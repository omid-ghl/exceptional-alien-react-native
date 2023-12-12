import {EditPlaybookTitleRequest} from './../../../Models/Requests/EditPlaybookTitleRequest';
import {EditPlaybookTitleResponse} from './../../../Models/Responses/EditPlaybookTitleResponse';
import {ApiEndpointBuilder} from '@/Services/api';

export default (build: ApiEndpointBuilder) =>
  build.mutation<EditPlaybookTitleResponse, EditPlaybookTitleRequest>({
    query: body => ({
      url: '/user/playbooks/edit',
      body: body,
      method: 'POST',
    }),
  });
