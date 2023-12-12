import {arrayToUrlParams} from '@/Utils';
import {CreateNewPlaybookResponse} from './../../../Models/Responses/CreateNewPlaybookResponse';
import {CreateNewPlaybookRequest, PlayBook} from '@/Models';
import {ApiEndpointBuilder} from '@/Services/api';

export default (build: ApiEndpointBuilder) =>
  build.mutation<PlayBook, CreateNewPlaybookRequest>({
    query: ({name, gems}) => ({
      url:
        '/user/playbooks/create?name=' + name + arrayToUrlParams('gems', gems),
      method: 'POST',
    }),
    transformResponse: (rawResult: CreateNewPlaybookResponse) => {
      return rawResult.data;
    },
  });
