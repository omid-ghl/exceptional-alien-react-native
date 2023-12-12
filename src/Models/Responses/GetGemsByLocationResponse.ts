import {Gem} from '../Gem';
import {PaginationResponse} from '../PaginationResponse';

export interface GetGemsByLocationResponse {
  success: 'true' | 'false';
  data: PaginationResponse<Gem>;
  count?: {gem_count?: number}[];
  gemCategories: number[];
}
