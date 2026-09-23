import rawNoticesData from '../../../notices.json';
import {
  Notice,
  NoticesFilterOptions,
  PaginatedNoticesResponse,
} from '@/types/notice';

// In-memory toggle for simulating 1-in-5 failure rate
let simulateFailures = true;

export const ApiConfig = {
  getSimulateFailures: () => simulateFailures,
  setSimulateFailures: (value: boolean) => {
    simulateFailures = value;
  },
  ARTIFICIAL_DELAY_MS: 500,
  DEFAULT_PAGE_SIZE: 10,
};

// Sort all notices newest first once
const allNotices: Notice[] = [...(rawNoticesData.notices as Notice[])].sort((a, b) => {
  return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
});

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Fetch paginated notices with optional category filter.
 * Simulates network delay and 1-in-5 random failure rate.
 */
export async function fetchNotices(
  options: NoticesFilterOptions = {}
): Promise<PaginatedNoticesResponse> {
  const { category = 'all', page = 1, pageSize = ApiConfig.DEFAULT_PAGE_SIZE } = options;

  await delay(ApiConfig.ARTIFICIAL_DELAY_MS);

  // 1 in 5 failure simulation (20% chance)
  if (simulateFailures && Math.random() < 0.2) {
    throw new Error('Network error: Failed to fetch community notices. Please try again.');
  }

  // Filter by category if not 'all'
  const filtered =
    category === 'all'
      ? allNotices
      : allNotices.filter((n) => n.category.toLowerCase() === category.toLowerCase());

  const total = filtered.length;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const items = filtered.slice(startIndex, endIndex);
  const hasMore = endIndex < total;

  return {
    items,
    page,
    pageSize,
    total,
    hasMore,
  };
}

/**
 * Fetch a single notice by ID.
 */
export async function fetchNoticeById(id: string): Promise<Notice> {
  await delay(ApiConfig.ARTIFICIAL_DELAY_MS / 2);

  if (simulateFailures && Math.random() < 0.2) {
    throw new Error('Network error: Unable to load notice details. Please try again.');
  }

  const notice = allNotices.find((n) => n.id === id);
  if (!notice) {
    throw new Error(`Notice with ID "${id}" was not found.`);
  }

  return notice;
}
