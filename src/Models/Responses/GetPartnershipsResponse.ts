import {PaginationResponse} from '../PaginationResponse';
import {Partnership} from '../Partnership';
import {ApiResponse} from './ApiResponse';

export interface GetPartnershipsResponse
  extends ApiResponse<PaginationResponse<Partnership>> {}
