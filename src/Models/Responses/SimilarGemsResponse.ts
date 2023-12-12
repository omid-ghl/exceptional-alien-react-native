import {Gem} from '../Gem';
import {PaginationResponse} from '../PaginationResponse';
import {ApiResponse} from './ApiResponse';

export interface SimilarGemsResponse
  extends ApiResponse<PaginationResponse<Gem>> {}
