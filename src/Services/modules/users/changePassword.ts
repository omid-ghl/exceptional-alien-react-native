import {ChangePasswordRequest} from './../../../Models/Requests/ChangePasswordRequest';
import {ChangePasswordResponse} from './../../../Models/Responses/ChangePasswordResponse';
import {ApiEndpointBuilder} from '@/Services/api';

export const changePassword = (build: ApiEndpointBuilder) =>
  build.mutation<ChangePasswordResponse, ChangePasswordRequest>({
    query: body => ({
      url: '/auth/update/password',
      body: body,
      method: 'POST',
    }),
    transformResponse: (rawResult?: any) => {
      return rawResult;
    },
  });
