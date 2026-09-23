export type NoticeCategory = 'all' | 'emergency' | 'event' | 'service' | 'general';

export type NoticePriority = 'normal' | 'high';

export interface Notice {
  id: string;
  title: string;
  body: string;
  category: Exclude<NoticeCategory, 'all'>;
  priority: NoticePriority;
  department: string;
  published_at: string;
  expires_at: string | null;
  image_url: string | null;
}

export interface PaginatedNoticesResponse {
  items: Notice[];
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
}

export interface NoticesFilterOptions {
  category?: NoticeCategory;
  page?: number;
  pageSize?: number;
}
