import {Industry} from '../Industry';
import {PaginationResponse} from '../PaginationResponse';

export interface ListIndustriesResponse {
  success: string;
  data: {
    options: PaginationResponse<Industry>;
    selected: unknown[];
  };
}
