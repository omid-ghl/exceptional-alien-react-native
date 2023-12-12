export interface Video {
  id: number;
  name: string;
  slug: string;
  description: string;
  is_active: number;
  author: string;
  cloudflare_primary_video: string;
  cloudflare_preview_video: string;
  preview_image: number;
  created_at: Date;
  updated_at: Date;
  cloudflare_hls_manifest_url: string;
  cloudflare_dash_manifest_url: string;
  cloudflare_download_url: string;
}
