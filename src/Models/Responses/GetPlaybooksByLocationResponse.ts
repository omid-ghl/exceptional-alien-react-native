import {PaginationResponse} from '../PaginationResponse';
import {PlayBook} from '../PlayBook';
import {ApiResponse} from './ApiResponse';

export interface GetPlaybooksByLocationResponse
  extends ApiResponse<PaginationResponse<PlayBook>> {}
