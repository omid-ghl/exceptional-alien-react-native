import {GemCategory} from './GemCategory';
import {Location} from './Location';

interface DescriptionUser {
  first_name: string;
  last_name: string;
  slug: string;
  profile_image: string;
  display_name_line_1: string;
  display_name_line_2: string;
  display_name_single_line: string;
  full_name: string;
  count_of_playbooks: number;
  count_of_gems: number;
}

interface Description {
  description: string;
  user_id: string;
  user?: DescriptionUser;
}

export interface Gem {
  id: number;
  name: string;
  description: Description[];
  is_active: number;
  location_id: number;
  created_at: Date;
  updated_at: Date;
  is_featured: number;
  feature_image: string;
  map: string;
  long: null;
  lat: null;
  location?: Location;
  map_address: string;
  url: string;
  photo_credit: string;
  photo_credit_url: null;
  has_location: number;
  url_cta: string;
  portrait_feature_image: string;
  photo_credit_font_colour: string;
  second_cta_url: string;
  second_cta_copy: string;
  like_count: number;
  image_url: any[];
  gem_categories: GemCategory[];
  playbooks: any[];
  web_address: string;
}
