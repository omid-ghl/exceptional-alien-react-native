export interface Interest {
  id: number;
  name: string;
  interest_type: 'industry' | 'location';
  interest_id: string;
  user_id: number;
  created_at: Date;
  updated_at: Date;
}
