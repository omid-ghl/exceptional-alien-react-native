import {GemCategory} from '../GemCategory';
import {ApiResponse} from './ApiResponse';

export interface GetGemCategoriesResponse extends ApiResponse<GemCategory[]> {}
