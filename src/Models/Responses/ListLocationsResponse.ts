import {Location} from '../Location';
import {PaginationResponse} from '../PaginationResponse';

export interface ListLocationsResponse {
  success: string;
  data: {
    options: PaginationResponse<Location>;
    selected: unknown[];
  };
}
