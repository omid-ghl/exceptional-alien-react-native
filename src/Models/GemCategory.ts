export interface GemCategory {
  id: number;
  name: string;
  description: null;
  is_active: number;
  created_at: Date;
  updated_at: Date;
  image_icon: number;
  icon_details: string;
  pivot?: {
    gem_id: number;
    gem_category_id?: number;
    created_at: Date | null;
    updated_at: Date | null;
    playbook_id?: number;
  };
}
