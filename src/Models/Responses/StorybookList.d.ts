import {Location} from '@/Models/Location';
import {User} from '@/Models/User';

export interface StorybookList {
  id: number;
  title: string;
  description: null;
  user_id: number;
  created_at: Date;
  updated_at: Date;
  location_id: number;
  is_active: number;
  photo_credit: string;
  tile_image: string;
  counter: number;
  primary_image: string;
  opengraph_image: string;
  photo_credit_url: null;
  slug: string;
  seo_title: string;
  seo_description: string;
  seo_image: string;
  order_date: Date;
  photo_credit_font_colour: string;
  tag_cloud: string;
  mobile_primary_image: string;
  podcast_id: number;
  video_id: null;
  podcast: object;
  location: Location;
  user?: User;
  gems: any[];
  // for others playbook
  name?: string;
}
