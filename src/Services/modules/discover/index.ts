import {closestLocation} from './closestLocation';
import {locationsList, locationById, randomLocation} from './locations';
import {api} from '@/Services/api';
import {filterPlaybooks, searchList} from './search';
import {gemCategories} from './gemCategories';

export const discoverApi = api.injectEndpoints({
  endpoints: build => ({
    gemCategories: gemCategories(build),
    searchList: searchList(build),
    filterPlaybooks: filterPlaybooks(build),
    locationsList: locationsList(build),
    closestLocation: closestLocation(build),
    locationById: locationById(build),
    randomLocation: randomLocation(build),
  }),
  overrideExisting: false,
});

export const {
  usePrefetch: useDisvocerPrefetch,
  useGemCategoriesQuery,
  useSearchListQuery,
  useFilterPlaybooksQuery,
  useLocationsListQuery,
  useLazyLocationsListQuery,
  useClosestLocationQuery,
  useLazyClosestLocationQuery,
  useLocationByIdQuery,
  useLazyLocationByIdQuery,
  useRandomLocationQuery,
  useLazyRandomLocationQuery,
} = discoverApi;
