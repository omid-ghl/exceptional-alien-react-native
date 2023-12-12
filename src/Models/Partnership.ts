import {PlayBook} from './PlayBook';
import {PartnershipStory} from './PartnershipStory';

export interface Partnership {
  id: number;
  title: string;
  slug: string;
  is_active: number;
  publish_at: Date;
  partner_name: string;
  about_partner: string;
  main_image?: number;
  main_image_url?: {
    path: string;
  };
  partner_logo?: number | string;
  partner_logo_url?: {
    path: string;
  };
  created_at: Date;
  updated_at: Date;
  count_playbooks: number;
  count_stories?: number;
  playbooks?: PlayBook[];
  partnership_stories?: PartnershipStory[];
  // web_address?: string;
}
