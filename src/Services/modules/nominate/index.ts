import {api} from '@/Services/api';
import {gemNomination} from './gemNomination';
import {locationNomination} from './locationNomination';
import {personNomination} from './personNomination';

export const tutorialApi = api.injectEndpoints({
  endpoints: build => ({
    gemNomination: gemNomination(build),
    locationNomination: locationNomination(build),
    personNomination: personNomination(build),
  }),
  overrideExisting: false,
});

export const {
  useGemNominationMutation,
  useLocationNominationMutation,
  usePersonNominationMutation,
} = tutorialApi;
