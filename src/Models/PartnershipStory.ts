import {Location} from './Location';
import {User} from './User';

export interface PartnershipStory {
  id: number;
  order_date: Date;
  publish_at: Date;
  title: string;
  slug: string;
  is_active: number;
  seo_title: null;
  seo_description: null;
  seo_image: null;
  tile_image: string;
  hero_image: string;
  mobile_hero_image: string;
  hero_image_credit: null;
  feature_image: null;
  mobile_feature_image: null;
  content: string;
  created_at: Date;
  updated_at: Date;
  partnership_id: number;
  location_id: number;
  location: Location;
  story_categories: unknown[];
  user_details: User;
}
