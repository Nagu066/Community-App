import { useCallback, useEffect, useState } from 'react';
import { fetchNoticeById } from '@/services/api/noticesApi';
import { NoticeStorage } from '@/services/storage/noticeStorage';
import { Notice } from '@/types/notice';

export function useNoticeDetail(id: string | undefined) {
  const [notice, setNotice] = useState<Notice | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async (noticeId: string | undefined) => {
    if (!noticeId) {
      setError('Notice ID is required.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchNoticeById(noticeId);
      setNotice(data);
      await NoticeStorage.markNoticeAsRead(noticeId);
    } catch (err: any) {
      setError(err?.message || 'Failed to load notice details.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    if (!id) {
      setError('Notice ID is required.');
      setIsLoading(false);
      return;
    }

    fetchNoticeById(id)
      .then(async (data) => {
        if (!ignore) {
          setNotice(data);
          setError(null);
          setIsLoading(false);
          await NoticeStorage.markNoticeAsRead(id);
        }
      })
      .catch((err: any) => {
        if (!ignore) {
          setError(err?.message || 'Failed to load notice details.');
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [id]);

  return {
    notice,
    isLoading,
    error,
    retry: () => fetchDetail(id),
  };
}
