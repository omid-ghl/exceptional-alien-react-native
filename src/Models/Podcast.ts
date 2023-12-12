export interface Podcast {
  audio_file: number;
  author: string;
  author_image: string | null;
  aws_job_id: string;
  aws_job_status: string;
  created_at: Date;
  description: string;
  file_processed: number;
  id: number;
  is_active: number;
  m3u8: string;
  m3u8_file: string;
  m3u8_folder: string;
  m3u8_url: string;
  name: string;
  slug: string;
  updated_at: Date;
}
