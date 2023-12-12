import {Gem} from './Gem';
import {Location} from './Location';
import {Podcast} from './Podcast';
import {User} from './User';

interface Description {
  description: string;
  user_id: string;
}

export interface PlayBook {
  counter: number;
  created_at: Date;
  updated_at: Date;
  description?: Description[];
  gems?: Gem[];
  id: number;
  is_active: number;
  location?: Location;
  location_id: number;
  mobile_primary_image: string;
  opengraph_image: string;
  order_date: Date;
  photo_credit: string;
  photo_credit_font_colour: string;
  photo_credit_url: null;
  podcast?: Podcast;
  podcast_id: number | null;
  primary_image: string;
  seo_description: string;
  seo_image: string;
  seo_title: string;
  slug: string;
  tag_cloud: string;
  tile_image: string;
  title: string;
  user?: User;
  user_id: number;
  video?: Array<any>;
  video_id: number | null;
  web_address?: string;
}
