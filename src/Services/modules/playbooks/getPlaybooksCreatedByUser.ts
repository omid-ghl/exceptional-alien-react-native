import {GetUserPlaybooksRequest} from './../../../Models/Requests/GetUserPlaybooksRequest';
import {ApiEndpointBuilder} from '@/Services/api';
import {PlayBook} from '@/Models';

export const getPlaybooksCreatedByUser = (build: ApiEndpointBuilder) =>
  build.query<PlayBook[], GetUserPlaybooksRequest>({
    query: () => ({
      url: 'user/playbooks/',
      params: {
        per_page: 199,
        page: 1,
      },
    }),
    transformResponse: (rawResult: {data: {data: PlayBook[]}}) => {
      return rawResult.data.data;
    },
  });
