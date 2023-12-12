export interface Industry {
  id: number;
  name: string;
  description: string;
  image?: any;
  icon?: any;
  icon_details?: string;
  created_at: Date;
  updated_at: Date;
  is_active: number;
  onboarding_selectable: number;
  slug: string;
  search_selectable: number;
  count_of_contributors: number;
  count_of_playbooks: number;
  count_of_stories: number;
  image_url: {
    id: number;
    title: string;
    created: string;
    type: string;
    folder: string;
    name: string;
    private: number;
    lp: number;
    options: {
      mime: string;
      wh: number[];
      size: string;
    };
    url: string;
    path: string;
  };
}
