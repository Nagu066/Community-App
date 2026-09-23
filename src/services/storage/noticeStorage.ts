import AsyncStorage from '@react-native-async-storage/async-storage';
import { Notice } from '@/types/notice';

const READ_NOTICES_KEY = '@melyn_read_notices_v1';
const CACHED_NOTICES_KEY = '@melyn_cached_notices_v1';

export const NoticeStorage = {
  /**
   * Get all IDs of notices marked as read.
   */
  async getReadNoticeIds(): Promise<string[]> {
    try {
      const data = await AsyncStorage.getItem(READ_NOTICES_KEY);
      if (!data) return [];
      return JSON.parse(data) as string[];
    } catch (e) {
      console.warn('Failed to load read notice IDs from storage:', e);
      return [];
    }
  },

  /**
   * Mark a notice ID as read and persist to storage.
   */
  async markNoticeAsRead(id: string): Promise<string[]> {
    try {
      const current = await NoticeStorage.getReadNoticeIds();
      if (!current.includes(id)) {
        const updated = [...current, id];
        await AsyncStorage.setItem(READ_NOTICES_KEY, JSON.stringify(updated));
        return updated;
      }
      return current;
    } catch (e) {
      console.warn(`Failed to mark notice ${id} as read:`, e);
      return [id];
    }
  },

  /**
   * Reset all read statuses (used for testing and dev tools).
   */
  async clearReadNotices(): Promise<void> {
    try {
      await AsyncStorage.removeItem(READ_NOTICES_KEY);
    } catch (e) {
      console.warn('Failed to clear read notices:', e);
    }
  },

  /**
   * Get cached notices for poor network / offline fallback.
   */
  async getCachedNotices(): Promise<Notice[]> {
    try {
      const data = await AsyncStorage.getItem(CACHED_NOTICES_KEY);
      if (!data) return [];
      return JSON.parse(data) as Notice[];
    } catch (e) {
      console.warn('Failed to load cached notices:', e);
      return [];
    }
  },

  /**
   * Cache the latest loaded notices list.
   */
  async saveCachedNotices(notices: Notice[]): Promise<void> {
    try {
      await AsyncStorage.setItem(CACHED_NOTICES_KEY, JSON.stringify(notices));
    } catch (e) {
      console.warn('Failed to cache notices:', e);
    }
  },

  /**
   * Clear cached notices.
   */
  async clearCache(): Promise<void> {
    try {
      await AsyncStorage.removeItem(CACHED_NOTICES_KEY);
    } catch (e) {
      console.warn('Failed to clear cached notices:', e);
    }
  },
};
