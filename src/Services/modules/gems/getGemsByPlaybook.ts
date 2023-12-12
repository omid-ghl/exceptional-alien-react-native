import {ApiEndpointBuilder} from '@/Services/api';
import {Gem} from '@/Models';

export const gemsByPlaybook = (build: ApiEndpointBuilder) =>
  build.query<Gem[], {playbook_id: number}>({
    query: ({playbook_id}) => ({
      url: 'gems/playbook',
      params: {
        playbook_id,
      },
    }),
    transformResponse: (rawResult: {data: Gem[]}) => rawResult.data,
  });
