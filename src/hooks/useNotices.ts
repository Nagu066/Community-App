import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiConfig, fetchNotices } from '@/services/api/noticesApi';
import { NoticeStorage } from '@/services/storage/noticeStorage';
import { Notice, NoticeCategory } from '@/types/notice';

export function useNotices() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [category, setCategoryState] = useState<NoticeCategory>('all');
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // Loading states
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  // Errors
  const [error, setError] = useState<string | null>(null);
  const [paginationError, setPaginationError] = useState<string | null>(null);

  // Stale data flag (when displaying cached data because network request failed)
  const [isStale, setIsStale] = useState<boolean>(false);

  // Read status set
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  // Failure simulation switch state
  const [simulateFailures, setSimulateFailuresState] = useState<boolean>(
    ApiConfig.getSimulateFailures()
  );

  // Guard against concurrent loadMore calls
  const isFetchingRef = useRef<boolean>(false);

  // Load persisted read IDs on mount
  useEffect(() => {
    let mounted = true;
    NoticeStorage.getReadNoticeIds().then((ids) => {
      if (mounted) {
        setReadIds(new Set(ids));
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Effect to load data when category changes
  useEffect(() => {
    let ignore = false;
    isFetchingRef.current = true;

    fetchNotices({
      category,
      page: 1,
    })
      .then(async (response) => {
        if (!ignore) {
          setNotices(response.items);
          setPage(1);
          setHasMore(response.hasMore);
          setIsStale(false);
          setError(null);
          setPaginationError(null);
          setIsLoading(false);
          isFetchingRef.current = false;

          if (category === 'all') {
            await NoticeStorage.saveCachedNotices(response.items);
          }
        }
      })
      .catch(async (err: any) => {
        if (!ignore) {
          const cached = await NoticeStorage.getCachedNotices();
          if (cached.length > 0) {
            const filteredCached =
              category === 'all'
                ? cached
                : cached.filter((n) => n.category.toLowerCase() === category.toLowerCase());

            setNotices(filteredCached);
            setIsStale(true);
            setError(null);
          } else {
            setError(err?.message || 'Failed to load notices.');
          }
          setIsLoading(false);
          isFetchingRef.current = false;
        }
      });

    return () => {
      ignore = true;
    };
  }, [category]);

  // Pull to refresh
  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    setError(null);
    setPaginationError(null);
    isFetchingRef.current = true;

    try {
      const response = await fetchNotices({
        category,
        page: 1,
      });

      setNotices(response.items);
      setPage(1);
      setHasMore(response.hasMore);
      setIsStale(false);

      if (category === 'all') {
        await NoticeStorage.saveCachedNotices(response.items);
      }
    } catch (err: any) {
      if (notices.length > 0) {
        setIsStale(true);
      } else {
        setError(err?.message || 'Refresh failed.');
      }
    } finally {
      setIsRefreshing(false);
      isFetchingRef.current = false;
    }
  }, [category, notices.length]);

  // Load more pages
  const loadMore = useCallback(async () => {
    if (isFetchingRef.current || !hasMore || isLoading || isRefreshing || isLoadingMore) {
      return;
    }

    setIsLoadingMore(true);
    setPaginationError(null);
    isFetchingRef.current = true;

    const nextPage = page + 1;

    try {
      const response = await fetchNotices({
        category,
        page: nextPage,
      });

      setNotices((prev) => [...prev, ...response.items]);
      setPage(nextPage);
      setHasMore(response.hasMore);
      setIsStale(false);
    } catch (err: any) {
      setPaginationError(err?.message || 'Failed to load more notices.');
    } finally {
      setIsLoadingMore(false);
      isFetchingRef.current = false;
    }
  }, [category, hasMore, isLoading, isLoadingMore, isRefreshing, page]);

  // Change category filter
  const setCategory = useCallback((newCategory: NoticeCategory) => {
    setIsLoading(true);
    setCategoryState(newCategory);
  }, []);

  // Refresh persisted read IDs from storage
  const refreshReadIds = useCallback(async () => {
    try {
      const ids = await NoticeStorage.getReadNoticeIds();
      setReadIds(new Set(ids));
    } catch (e) {
      console.warn('Failed to refresh read notice IDs:', e);
    }
  }, []);

  // Mark notice as read (optimistic update + persistence)
  const markAsRead = useCallback(async (id: string) => {
    // Immediately update local set with a new reference so FlatList extraData triggers re-render
    setReadIds((prev) => new Set([...prev, id]));
    try {
      const updated = await NoticeStorage.markNoticeAsRead(id);
      if (updated && updated.length > 0) {
        setReadIds(new Set(updated));
      }
    } catch (e) {
      console.warn('Failed to persist read status:', e);
    }
  }, []);

  // Clear read notices (for dev / testing)
  const clearReadNotices = useCallback(async () => {
    await NoticeStorage.clearReadNotices();
    setReadIds(new Set());
  }, []);

  // Toggle failure simulation
  const toggleSimulateFailures = useCallback(() => {
    const nextVal = !ApiConfig.getSimulateFailures();
    ApiConfig.setSimulateFailures(nextVal);
    setSimulateFailuresState(nextVal);
  }, []);

  return {
    notices,
    category,
    setCategory,
    page,
    hasMore,
    isLoading,
    isRefreshing,
    isLoadingMore,
    error,
    paginationError,
    isStale,
    readIds,
    isRead: (id: string) => readIds.has(id),
    markAsRead,
    refreshReadIds,
    clearReadNotices,
    refresh,
    loadMore,
    simulateFailures,
    toggleSimulateFailures,
  };
}
