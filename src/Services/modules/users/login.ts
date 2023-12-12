import {LoginRequest, LoginResponse} from '@/Models';
import {ApiEndpointBuilder} from '@/Services/api';

export default (build: ApiEndpointBuilder) =>
  build.mutation<LoginResponse, LoginRequest>({
    query: loginRequest => ({
      url: 'auth/login',
      body: loginRequest,
      method: 'POST',
    }),
    invalidatesTags: result => (result ? ['User', 'Unauthorized'] : []),
  });
