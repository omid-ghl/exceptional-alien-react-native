export interface UpsertInterestsRequest {
  type: 'industry' | 'location';
  interests: number[];
}
