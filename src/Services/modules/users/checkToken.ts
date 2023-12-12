import {User} from '@/Models';
import {ApiEndpointBuilder} from '@/Services/api';

export const checkToken = (build: ApiEndpointBuilder) =>
  build.query<User, void>({
    query: () => 'token/check',
    providesTags: ['User'],
  });
