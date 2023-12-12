import {AddNewGemRequest, AddNewGemResponse} from '@/Models';
import {ApiEndpointBuilder} from '@/Services/api';

export default (build: ApiEndpointBuilder) =>
  build.mutation<AddNewGemResponse, AddNewGemRequest>({
    query: body => ({
      url: '/bookmarks/add/gem',
      body: body,
      method: 'POST',
    }),
    invalidatesTags: (result, error, arg) =>
      result
        ? [
            {type: 'GemLikes' as const, id: arg.gem_id},
            {type: 'GemCollected' as const, id: arg.gem_id},
          ]
        : [],
  });
