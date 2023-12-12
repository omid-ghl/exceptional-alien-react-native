import {Location} from './Location';
import {PlayBook} from './PlayBook';
import {User} from './User';

export interface ContentBlocks {
  layout?:
    | 'full_width_image_slider_parallax'
    | 'Video'
    | 'vimeo_video'
    | 'infocus_slider'
    | 'author'
    | 'interview_intro'
    | 'h2_block'
    | 'text_block'
    | 'full_width_image'
    | 'caption'
    | 'pull_quote'
    | 'single_image'
    | 'gem'
    | 'image_left_right';
  attributes?: {
    pull_quote?: string;
    feature_copy?: string;
    copy?: string;
    heading_copy?: string;
    image?: string;
    caption?: string;
    id?: string;
    quote?: string;
  };
}

export interface Story {
  id: number;
  title: string;
  user_id: number;
  created_at: Date;
  updated_at: Date;
  tile_image: string;
  hero_image: string;
  mobile_hero_image: string;
  is_active: number;
  is_featured: number;
  mobile_feature_image: null | string;
  feature_image: null | string;
  playbook_id: number;
  publish_at: Date;
  counter: number;
  slug: string;
  order_date: Date;
  preview_auth: null;
  seo_title: null | string;
  seo_description: null | string;
  seo_image: null | string;
  tag_cloud: string;
  hero_image_credit: null;
  video_header: null;
  mobile_video_header: null;
  story_location: Location;
  new_badge: boolean;
  count_of_gems: number;
  user_details?: User;
  story_categories: any[];
  playbook: PlayBook;
  content_blocks: ContentBlocks[];
}
