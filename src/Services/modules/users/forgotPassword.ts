import {ForgotPasswordRequest, ForgotPasswordResponse} from '@/Models';
import {ApiEndpointBuilder} from '@/Services/api';

export default (build: ApiEndpointBuilder) =>
  build.mutation<ForgotPasswordResponse, ForgotPasswordRequest>({
    query: body => ({
      url: 'auth/reset/email',
      body: body,
      method: 'POST',
    }),
  });
