import {Gem} from '../Gem';
import {PaginationResponse} from '../PaginationResponse';
import {ApiResponse} from './ApiResponse';

export interface GetGemsByPlaybookResponse
  extends ApiResponse<PaginationResponse<Gem>> {}
