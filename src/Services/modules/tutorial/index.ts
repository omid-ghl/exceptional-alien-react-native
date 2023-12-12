import {api} from '@/Services/api';
import {tutorialFinished} from './tutorial';

export const tutorialApi = api.injectEndpoints({
  endpoints: build => ({
    tutorialFinished: tutorialFinished(build),
  }),
  overrideExisting: false,
});

export const {useTutorialFinishedMutation} = tutorialApi;
