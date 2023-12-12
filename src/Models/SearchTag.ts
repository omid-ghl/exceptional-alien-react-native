export interface SearchTag {
  slug: string;
  name: string;
  count_of_contributors: number;
  count_of_playbooks: number;
  count_of_stories: number;
}

export interface DiscoverIndustry {
  id: number;
  name: string;
  description: string | null;
  is_active: number;
  created_at: string;
  updated_at: string;
  image_icon: number;
  playbooks_count: number;
  icon_details: string | null;
}

export interface CountryTag {
  country_code: string;
  country: string;
  playbooks_count: number;
}
