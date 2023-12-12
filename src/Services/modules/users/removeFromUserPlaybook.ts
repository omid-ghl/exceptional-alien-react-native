import {
  RemoveExistPlaybookRequest,
  RemoveExistPlaybookResponse,
} from '@/Models';
import {ApiEndpointBuilder} from '@/Services/api';

export default (build: ApiEndpointBuilder) =>
  build.mutation<RemoveExistPlaybookResponse, RemoveExistPlaybookRequest>({
    query: params => ({
      url: '/user/playbooks',
      params,
      method: 'DELETE',
    }),
    transformResponse: (rawResult: {data: {data: any}}) => {
      // alert(JSON.stringify(rawResult.data));
      return rawResult.data.data;
    },
  });
