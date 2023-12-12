import {ResendEmailRequest, ResendEmailResponse} from '@/Models';
import {ApiEndpointBuilder} from '@/Services/api';

export default (build: ApiEndpointBuilder) =>
  build.mutation<ResendEmailResponse, ResendEmailRequest>({
    query: body => ({
      url: 'auth/resendVerification',
      params: body,
      method: 'POST',
    }),
  });
