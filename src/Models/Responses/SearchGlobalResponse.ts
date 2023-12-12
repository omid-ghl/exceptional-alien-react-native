import {Location} from '../Location';
import {PlayBook} from '../PlayBook';
import {Story} from '../Story';
import {User} from '../User';
import {ApiResponse} from './ApiResponse';

export interface SearchGlobalResponse
  extends ApiResponse<{
    contributors?: User[];
    stories?: Story[];
    playbooks?: PlayBook[];
    locations?: Location[];
  }> {}
