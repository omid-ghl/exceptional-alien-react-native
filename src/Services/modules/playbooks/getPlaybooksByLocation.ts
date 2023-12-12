import {ApiEndpointBuilder} from '@/Services/api';
import {GetPlaybooksByLocationRequest} from '@/Models/Requests/GetPlaybooksByLocationrequest';
import {PLAYBOOKS_LIST_PER_PAGE} from '@/constants/common';
import {GetPlaybooksByLocationResponse, PlayBook} from '@/Models';
import {PaginationResponse} from '@/Models/PaginationResponse';

export const playbooksByLocation = (build: ApiEndpointBuilder) =>
  build.query<PaginationResponse<PlayBook>, GetPlaybooksByLocationRequest>({
    query: ({
      locationId,
      page,
      perPage = PLAYBOOKS_LIST_PER_PAGE,
      playbookCategoryId,
    }) => ({
      url: 'playbooks/location',
      params: {
        location_id: locationId,
        page: page,
        per_page: perPage,
        industry_id: playbookCategoryId,
        order_by: 'desc',
        order_by_column: 'created_at',
      },
    }),
    transformResponse: (rawResult: GetPlaybooksByLocationResponse) => {
      return rawResult.data;
    },
  });
