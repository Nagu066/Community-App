import { Notice } from '@/types/notice';

/**
 * Format ISO date string into a user-friendly format (e.g. "Sep 20, 2026 • 6:00 AM").
 */
export function formatNoticeDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
}

/**
 * Check if a notice is already expired relative to current time.
 */
export function isNoticeExpired(notice: Notice): boolean {
  if (!notice.expires_at) return false;
  const expiry = new Date(notice.expires_at).getTime();
  return !isNaN(expiry) && expiry < Date.now();
}

/**
 * Check if a notice has a published date in the future.
 */
export function isNoticeFuture(notice: Notice): boolean {
  const published = new Date(notice.published_at).getTime();
  return !isNaN(published) && published > Date.now();
}

/**
 * Category colors for visual tagging.
 */
export const CATEGORY_COLORS: Record<
  string,
  { bg: string; text: string; border: string; label: string }
> = {
  emergency: {
    bg: '#FEE2E2',
    text: '#DC2626',
    border: '#FECACA',
    label: 'Emergency',
  },
  event: {
    bg: '#EDE9FE',
    text: '#7C3AED',
    border: '#DDD6FE',
    label: 'Event',
  },
  service: {
    bg: '#E0F2FE',
    text: '#0284C7',
    border: '#BAE6FD',
    label: 'Service',
  },
  general: {
    bg: '#F1F5F9',
    text: '#475569',
    border: '#E2E8F0',
    label: 'General',
  },
};
