import {RemoveExistGemRequest} from './../../../Models/Requests/RemoveExistGemRequest';
import {RemoveExistGemResponse} from './../../../Models/Responses/RemoveExistGemResponse';
import {ApiEndpointBuilder} from '@/Services/api';

export default (build: ApiEndpointBuilder) =>
  build.mutation<RemoveExistGemResponse, RemoveExistGemRequest>({
    query: body => ({
      url: '/bookmarks/remove/gem',
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
