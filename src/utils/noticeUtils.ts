import { Feather } from '@expo/vector-icons';
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

export type FeatherIconName = keyof typeof Feather.glyphMap;

/**
 * Refined category colors & vector icon mapping for a clean, premium feel.
 */
export const CATEGORY_COLORS: Record<
  string,
  { bg: string; text: string; border: string; label: string; icon: FeatherIconName }
> = {
  emergency: {
    bg: '#FEF2F2',
    text: '#DC2626',
    border: '#FECACA',
    label: 'Emergency',
    icon: 'alert-triangle',
  },
  event: {
    bg: '#F5F3FF',
    text: '#7C3AED',
    border: '#DDD6FE',
    label: 'Event',
    icon: 'calendar',
  },
  service: {
    bg: '#F0F9FF',
    text: '#0284C7',
    border: '#BAE6FD',
    label: 'Service',
    icon: 'tool',
  },
  general: {
    bg: '#F8FAFC',
    text: '#475569',
    border: '#E2E8F0',
    label: 'General',
    icon: 'bell',
  },
};
