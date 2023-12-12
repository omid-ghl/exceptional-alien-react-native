import {SignupRequest, SignupResponse} from '@/Models';
import {ApiEndpointBuilder} from '@/Services/api';

export default (build: ApiEndpointBuilder) =>
  build.mutation<SignupResponse, SignupRequest>({
    query: signupRequest => ({
      url: 'auth/register',
      body: signupRequest,
      method: 'POST',
    }),
  });
