import {editProfileRequest, editProfileResponse} from '@/Models';
import {ApiEndpointBuilder} from '@/Services/api';

export default (build: ApiEndpointBuilder) =>
  build.mutation<editProfileResponse, editProfileRequest>({
    query: body => ({
      url: 'users/edit',
      body: body,
      method: 'POST',
    }),
  });
