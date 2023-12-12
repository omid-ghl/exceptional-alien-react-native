import {ApiEndpointBuilder} from '@/Services/api';
import {TutorialFinishedRequest, TutorialFinishedResponse} from '@/Models';

export const tutorialFinished = (build: ApiEndpointBuilder) =>
  build.mutation<TutorialFinishedResponse, TutorialFinishedRequest>({
    query: body => ({
      url: 'users/finished/tutorial',
      method: 'POST',
      params: body,
    }),
    invalidatesTags: result => (result ? ['User'] : []),
  });
